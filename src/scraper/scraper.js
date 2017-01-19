import {
    getAssets,
    getPageLinks,
} from './helpers';

import cheerio from 'cheerio';

export default class Scraper {

    constructor() {
    }

    scrape(html) {
        const result = {
            assets: {
                stylesheets: [],
                images: [],
                scripts: []
            },
            pageLinks: []
        };
        if (html) {
            const $cheerio = cheerio.load(html);
            result.assets = getAssets($cheerio);
            result.pageLinks = getPageLinks($cheerio);
        }
        return result;
    }

}