import RequestQueue from './request-queue';
import {
    getDomain,
    getProtocol,
    isHtml,
    createRequestItem
} from './helpers';

import request from 'request';

export default class RequestProcessor {

    constructor({
        maxConcurrentRequests = 1,
        requestTimeout = 3000,
        sameDomain = true,
        sameProtocol = true,
        domain = '',
        protocol = 'http',
        maxDepth = 0,
        maxRetryCount = 1,
    } = {}) {
        this._domain = domain;
        this._protocol = protocol;
        this._sameDomain = sameDomain;
        this._sameProtocol = sameProtocol;
        this._maxConcurrentRequests = maxConcurrentRequests;
        this._maxDepth = maxDepth;
        this._requestTimeout = requestTimeout;
        this._requestQueue = new RequestQueue();
        this._currentRequests = new Map();
        this._seenUrls = new Set();
        this._maxRetryCount = maxRetryCount;
    }

    get reaminingRequests() {
        return this._requestQueue.size;
    }

    process(onResponse = () => { }, onError = () => { }) {
        const requestItem = this._requestQueue.peek(); // take a look at the first request in the queue
        if (!this._canProcess(requestItem)) { // if we cannot process it, do nothing
            return;
        }
        this._currentRequests.set(requestItem.url, requestItem); // add the request to out current request map
        this._requestQueue.dequeue(); // remove the request from the queue
        // perform the request
        request.get(requestItem.url, { timeout: this._requestTimeout }, (error, response, body) => {
            this._currentRequests.delete(requestItem.url); // remove the request from our proccessing list regardless of the result
            if (error) {
                if (!this._retry(requestItem)) {
                    onError(requestItem, error);
                }
            }
            if (!error && this._acceptResponse(response)) {
                console.log(`Discovered: ${this._seenUrls.size} unique URLS. Currently processing: ${this._currentRequests.size} requests. There are ${this._requestQueue.size} requests left in the queue`);
                onResponse(requestItem, body);
            }

        });
    }

    _retry(requestItem) {
        if (this._canRetry(requestItem)) {
            requestItem.retries += 1;
            this._requestQueue.enqueue(requestItem);
            return true;
        }
        return false;
    }

    _canRetry(requestItem) {
        return requestItem && requestItem.retries < this._maxRetryCount;
    }

    addToQueue(url, parent = null) {
        if (!parent) { // if we dont have a parent, set one up
            parent = {
                url: url,
                depth: 0
            }
        }
        const requestItem = createRequestItem(url, parent);
        if (this._canQueue(requestItem)) {
            this._seenUrls.add(requestItem.url);
            this._requestQueue.enqueue(requestItem); // queue the requestItem
        }
    }

    _canProcess(requestItem) {
        return requestItem &&
            this._currentRequests.size <= this._maxConcurrentRequests;
    }

    _canQueue(requestItem) {
        if (!requestItem) {
            return false;
        }
        if (this._seenUrls.has(requestItem.url)) { // only queue urls that we haven't already seen it
            return false;
        }
        if (this._maxDepth > 0 && requestItem.depth > this._maxDepth) { // if max depth is 0, we aren't limiting the depth
            return false;
        }
        if (this._sameDomain && this._domain !== requestItem.host) {
            return false;
        }
        if (this._sameProtocol && this._protocol !== requestItem.protocol) {
            return false;
        }
        return true;
    }

    _acceptResponse(response) {
        return response.statusCode === 200 && isHtml(response);
    }

    _isProcessing() {
        return this._currentRequests.size !== 0;
    }
}