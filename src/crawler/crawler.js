import Scraper from '../scraper';
import RequestProcessor from './request-processor';
import {
    getDomain,
    getProtocol,
} from './helpers';
import EventEmitter from 'events';

export default class Crawler extends EventEmitter {

    /**
     * Creates an instance of Crawler.
     * 
     * @param {any} [{
     *         startUrl: The url to start the crawl from.
     *         maxDepth: The maxium depth of the crawl, if 0, the depth isnt limited
     *         maxConcurrentRequests: The maximum number of HTTP request to process at once
     *         requestInterval: The interval between each loop.
     *         sameDomain: If true, crawling has to be on the same domain as the start url
     *         sameProtocol: If true, crawling has to be on the same protocol as the start url
     *         requestTimeout: The maximum amount of time to wait for a request
     *         maxRetryCount: The number of times a request can be retried
     *         maxResultSize: The maximum number of results too accept
     *         maxQueueSize: The maximum number of items that can be in the queue
     *     }={}]
     * 
     * @memberOf Crawler
     */
    constructor({
        startUrl = 'http://www.example.com',
        maxDepth = 0,
        maxConcurrentRequests = 4,
        requestInterval = 250,
        sameDomain = true,
        sameProtocol = true,
        requestTimeout = 10000,
        maxRetryCount = 1,
        maxResultSize = 200000,
        maxQueueSize = 200000,
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
            maxQueueSize: maxQueueSize,
        });
        this._maxResultSize = maxResultSize;
        this._scraper = new Scraper(); // setup our scraper
        this._startUrl = startUrl;
        this._requestInterval = requestInterval;
        this._runIntervalRef = null;
        this._results = [];
        this._errors = {};
    }

    /**
     * Starts the crawling process.
     * Emits the started event.
     * 
     * @memberOf Crawler
     */
    start() {
        this._requestProcessor.addToQueue(this._startUrl) // queue the first request
        this._crawl(); // start the crawling loop
        this.emit('started');
    }

    /**
     * Stops the crawling process.
     * When succesfully stopped it emits the finished event.
     * 
     * 
     * @memberOf Crawler
     */
    stop() {
        setTimeout(() => {
            if (!this._runIntervalRef) { // we must have a _runIntervalRef, otherwise we havent started!
                throw new Error('Cannot stop crawling as start was not called');
            }
            clearInterval(this._runIntervalRef); // clear the interval to stop the loop
            this.emit('finished', this._results, this._errors); // emit our results and errors
        }, this._requestInterval);
    }

    /**
     * The main crawl loop.
     * The loop is run every requestInterval. 
     * 
     * @private
     * @memberOf Crawler
     */
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

    /**
     * This is a callback that is passed to _requestProcessor.process
     * It is called when a request is succesfully fetched.
     * Emits the page event.
     * 
     * @param {any} requestItem the requestItem that was fetched
     * @param {any} body the body of the response
     * @private
     * @memberOf Crawler
     */
    _onRequestResult(requestItem, body) {
        if (this._results.length + 1 > this._maxResultSize) {
            this.stop();
            return;
        }
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

    /**
     * This is a callback that is passed to _requestProcessor.process
     * It is called when a request fetch fails
     * 
     * @param {any} requestItem
     * @param {any} error
     * @private
     * @memberOf Crawler
     */
    _onRequestError(requestItem, error) {
        this._errors[requestItem.url] = { // add the error to our _errors array
            retries: requestItem.retries,
            reason: error
        };
    }

    /**
     * Returns true if we have finished crawling.
     * We have finished if there are no more remaining requests and 
     * our _requestProcessor is no longer processing
     * 
     * @returns {boolean}
     * @private
     * @memberOf Crawler
     */
    _isFinished() {
        return this._requestProcessor.reaminingRequests() === 0 &&
            !this._requestProcessor._isProcessing();
    }

}