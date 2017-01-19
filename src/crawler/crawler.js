import Scraper from '../scraper';

import request from 'request';

export default class Crawler {

    constructor(startUrl) {
        this.startUrl = startUrl;
        this.scraper = new Scraper();
    }

    crawl() {
        request.get(this.startUrl, (error, response, body) => {
            const {pageLinks, assets} = this.scraper.scrape(body);
            console.log(pageLinks);
        });
    }

}