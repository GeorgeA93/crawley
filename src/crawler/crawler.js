import Scraper from '../scraper';
import RequestProcessor from './request-processor';
import {
    getDomain,
    getProtocol,
} from './helpers';
import EventEmitter from 'events';

export default class Crawler extends EventEmitter {

    constructor({
        startUrl = 'http://www.example.com',
        maxDepth = 0,
        maxConcurrentRequests = 4,
        requestInterval = 250,
        sameDomain = true,
        sameProtocol = true,
        requestTimeout = 10000,
        maxRetryCount = 1,
    } = {}) {
        super();
        this._domain = getDomain(startUrl); // grab the domain from the startUrl
        if (!this._domain) {
            throw new Error(`Invalid start url: ${startUrl}. Could not extract the domain`);
        }
        this._protocol = getProtocol(startUrl); // grab the protocol from the startUrl
        if (!this._protocol) {
            throw new Error(`Invalid start url: ${startUrl}. Could not extract the protocol`);
        }
        this._requestProcessor = new RequestProcessor({ // setup our request processor
            maxConcurrentRequests: maxConcurrentRequests,
            domain: this._domain,
            protocol: this._protocol,
            sameDomain: sameDomain,
            sameProtocol: sameProtocol,
            requestTimeout: requestTimeout,
            maxDepth: maxDepth,
            maxRetryCount: maxRetryCount,
        });
        this._scraper = new Scraper(); // setup our scraper
        this._startUrl = startUrl;
        this._requestInterval = requestInterval;
        this._runIntervalRef = null;
        this._results = [];
        this._errors = {};
    }

    start() {
        this._requestProcessor.addToQueue(this._startUrl) // queue the first request
        this._crawl(); // start the crawling loop
        this.emit('started');
    }

    stop() {
        setTimeout(() => {
            if (!this._runIntervalRef) {
                throw new Error('Cannot stop crawling as start was not called');
            }
            clearInterval(this._runIntervalRef); // clear the interval to stop the loop
            this.emit('finished', this._results, this._errors); // emit our results and errors
        }, this._requestInterval);
    }

    _crawl() {
        process.nextTick(() => {
            this._runIntervalRef = setInterval(() => { // run the following at every requestInterval
                this._requestProcessor.process(this._onRequestResult.bind(this), this._onRequestError.bind(this)); // process the current request
                if (this._isFinished()) { // if we are finished
                    this.stop();
                }
            }, this._requestInterval);
        });
    }

    _onRequestResult(requestItem, body) {
        const {pageLinks, assets} = this._scraper.scrape(body); // scrape new links and assets from the body
        this._results.push({ // add it to our results array
            url: requestItem.url,
            assets: assets
        });
        pageLinks.forEach((pageLink) => { // for every discovered page link, queue another request
            this._requestProcessor.addToQueue(pageLink, { url: requestItem.url, depth: requestItem.depth });
        });
        this.emit('page', requestItem);
    }

    _onRequestError(requestItem, error) {
        this._errors[requestItem.url] = {
            retries: requestItem.retries,
            reason: error
        };
    }

    _isFinished() {
        return this._requestProcessor.reaminingRequests === 0 &&
            !this._requestProcessor._isProcessing();
    }

}