import {
    getAssets,
    getPageLinks,
} from './helpers';

import cheerio from 'cheerio';

export default class Scraper {

    /**
     * Creates an instance of Scraper.
     * 
     * 
     * @memberOf Scraper
     */
    constructor() {
    }

    /**
     * Scrapes html to find assets (images, javascript and css) and page links
     * 
     * @param {any} html
     * @returns {any} The assets and page links that were scraped from the html
     * 
     * @memberOf Scraper
     */
    scrape(html) {
        const result = { // setup a default result
            assets: {
                stylesheets: [],
                images: [],
                scripts: []
            },
            pageLinks: []
        };
        if (html) {
            const $cheerio = cheerio.load(html); // load the html into cheerio
            result.assets = getAssets($cheerio); // grab the assets
            result.pageLinks = getPageLinks($cheerio); // grab the page links
        }
        return result;
    }

}