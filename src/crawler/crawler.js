import Scraper from '../scraper';
import {
    isHtml,
    createRequestItem,
    getDomain
} from './helpers';

import request from 'request';

export default class Crawler {

    constructor(startUrl) {
        this.domain = getDomain(startUrl);
        if (!this.domain) {
            throw new Error(`Invalid start url: ${startUrl}. Could not extract the domain`);
        }
        this.startUrl = startUrl;
        this.scraper = new Scraper();
        this.requestItems = new Map();
    }

    start() {
        /* process.nextTick(() => {
            setInterval(() => {
                this._crawl();
            }, 200);
        });*/

        this._crawl();
    }

    _crawl() {
        this._performRequest(this.startUrl, { url: this.startUrl, depth: 0 });
    }


    _performRequest(url, parent) {
        const requestItem = createRequestItem(url, parent);
        if (!this._canProcessRequestItem(requestItem)) {
            return;
        } else {
            console.log(`Processing: ${requestItem.host} with depth: ${requestItem.depth}`);
        }

        this.requestItems.set(requestItem.url, requestItem);
        request.get(requestItem.url, (error, response, body) => {
            requestItem.fetched = true;
            this.requestItems.set(requestItem.url, requestItem);
            if (!error && this._acceptResponse(response)) {
                const {pageLinks, assets} = this.scraper.scrape(body);
                pageLinks.forEach((pageLink) => {
                    this._performRequest(pageLink, { url: requestItem.url, depth: requestItem.depth });
                });
            }
        })
    }

    _canProcessRequestItem(requestItem) {
        return requestItem &&
            requestItem.host === this.domain &&
            !this.requestItems.has(requestItem.url) &&
            requestItem.depth < 10;
    }

    _acceptResponse(response) {
        return response.statusCode === 200 && isHtml(response);
    }


}