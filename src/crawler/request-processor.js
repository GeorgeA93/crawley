import RequestQueue from './request-queue';
import {
    getDomain,
    getProtocol,
    isHtml,
    createRequestItem
} from './helpers';

import request from 'request';

export default class RequestProcessor {

    /**
     * Creates an instance of RequestProcessor.
     * 
     * @param {any} [{
     *         maxConcurrentRequests: the number of requests we can process at once
     *         requestTimeout: the time to wait for each request
     *         sameDomain: If true, crawling has to be on the same domain as the start url
     *         sameProtocol: If true, crawling has to be on the same protocol as the start url
     *         domain: The domain that we want to stay on
     *         protocol: The protocol we want to stay on
     *         maxDepth: The maxium depth of the crawl, if 0, the depth isnt limited
     *         maxRetryCount: The number of times a request can be retried
     *         maxQueueSize: The maxium number of items that can be in the queue
     *         robots: The robots parser, you must pass this if you want to respect the robots.txt
     *     }={}]
     * 
     * @memberOf RequestProcessor
     */
    constructor({
        maxConcurrentRequests = 1,
        requestTimeout = 10000,
        sameDomain = true,
        sameProtocol = true,
        domain = '',
        protocol = 'http',
        maxDepth = 0,
        maxRetryCount = 1,
        maxQueueSize = 200000,
        robots = null,
    } = {}) {
        this._domain = domain;
        this._protocol = protocol;
        this._sameDomain = sameDomain;
        this._sameProtocol = sameProtocol;
        this._maxConcurrentRequests = maxConcurrentRequests;
        this._maxDepth = maxDepth;
        this._requestTimeout = requestTimeout;
        this._requestQueue = new RequestQueue(maxQueueSize);
        this._currentRequests = new Map();
        this._seenUrls = new Set();
        this._maxRetryCount = maxRetryCount;
        this._robots = robots;
    }

    /**
     * @returns{number} the number of remaining requests which is the size of our request queue
     * 
     * @memberOf RequestProcessor
     */
    remainingRequests() {
        return this._requestQueue.size;
    }

    /**
     * 
     * Attempts to request an item. If we cannot process anything, we return immediately.
     * If we can, we dequeue the item, add it to our _currentRequests array and perform a HTTP get on the url.
     * If there was an error, we attempt to retry the request. If we couldnt retry, we call the onError callback.
     * If it was successful, and we can accept the response, we call the onResponse callback.
     * 
     * @param {any} [onResponse=() => { }] callback when we receive a successful result
     * @param {any} [onError=() => { }] callback when we receive an error
     * @returns if we cannot process an item
     * 
     * @memberOf RequestProcessor
     */
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

    /**
     * 
     * Attempts to retry a request.
     * We can only retry if the request item hasn't exceeded the maxium number of retries.
     * 
     * @param {any} requestItem The requestItem to retry
     * @returns {boolean} True if we could retry, otherwise false.
     * @private
     * @memberOf RequestProcessor
     */
    _retry(requestItem) {
        if (this._canRetry(requestItem)) {
            requestItem.retries += 1;
            this._requestQueue.enqueue(requestItem);
            return true;
        }
        return false;
    }

    /**
     * We can only retry items if the items retries is less than the _maxRetryCount
     * 
     * @param {any} requestItem
     * @returns true if we can retry otherwise false.
     * @private
     * @memberOf RequestProcessor
     */
    _canRetry(requestItem) {
        return requestItem && requestItem.retries < this._maxRetryCount;
    }

    /**
     * Adds an item to our processing queue. Only if we can queue the item
     * 
     * @param {any} url The url to process
     * @param {any} [parent=null] The parent object, containing the url and the depth
     * @private
     * @memberOf RequestProcessor
     */
    addToQueue(url, parent = null) {
        if (!parent) { // if we dont have a parent, set one up
            parent = {
                url: url,
                depth: 0
            }
        }
        const requestItem = createRequestItem(url, parent, this.robots); // create the request item
        if (this._canQueue(requestItem)) { // if we can queue it
            this._seenUrls.add(requestItem.url); // add to our seen set
            this._requestQueue.enqueue(requestItem); // queue the requestItem
        }
    }

    /**
     * We can only process items if they are null and we arent processing more than the _maxConcurrentRequests
     * 
     * @param {any} requestItem
     * @returns {boolean} True if we can process the item otherwise false
     * @private
     * @memberOf RequestProcessor
     */
    _canProcess(requestItem) {
        return requestItem &&
            this._currentRequests.size <= this._maxConcurrentRequests;
    }

    /**
     * We can only queue items if: they aren't null and we havent already seen them
     * If our _maxDepth isnt 0, we cannot queue if the requestItem exceeds our max depth
     * If _sameDomain is true, we cannot queue if the requestItem is on a different domain.
     * If _sameProtocol is true, we cannot queue if the requestItem uses a different protocol.
     * 
     * @param {any} requestItem
     * @returns True if we can queue the item, otherwise false
     * @private
     * @memberOf RequestProcessor
     */
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

    /**
     * We only accept responses with the HTTP 200 status code and responses whose content type is html
     * 
     * @param {any} response
     * @returns {boolean} True if we can accept the response, otherwise false
     * @private
     * @memberOf RequestProcessor
     */
    _acceptResponse(response) {
        return response.statusCode === 200 && isHtml(response);
    }

    /**
     * We are proccessing when our _currentRequests array has a length greater than 0
     * 
     * @returns True if we are processing, otherwise false.
     * @private
     * @memberOf RequestProcessor
     */
    _isProcessing() {
        return this._currentRequests.size > 0;
    }
}