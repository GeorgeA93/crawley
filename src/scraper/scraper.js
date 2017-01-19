import {
    getAssets,
    getPageLinks,
} from './helpers';

import cheerio from 'cheerio';

export default class Scraper {

    constructor() {
    }

    scrape(html) {
        const $cheerio = cheerio.load(html);
        const assets = getAssets($cheerio);
        const pageLinks = getPageLinks($cheerio);
        return {
            assets: assets,
            pageLinks: pageLinks
        };
    }

}