import request from 'request';
import cheerio from 'cheerio';
import { isUndefined } from 'lodash';

const startUrl = 'https://gocardless.com';

request(startUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
        const $cheerio = cheerio.load(body);
        const pageLinks = getPageLinks($cheerio);
        const assets = getAssets($cheerio);
        console.log(assets);
    }
});

function getPageLinks($cheerio) {
    let results = [];
    $cheerio('a').each((index, element) => {
        const $el = $cheerio(element);
        const href = $el.attr('href');
        if (!isUndefined(href)) {
            results.push(href);
        }
    });
    // get alternates (different language versions of the web page)
    $cheerio('link').each((index, element) => {
        const $el = $cheerio(element);
        if (isAlternate($el)) {
            const href = $el.attr('href');
            if (!isUndefined(href)) {
                results.push(href);
            }
        }
    });
    return results;
}

function isAlternate(element) {
    return element.attr('rel') && element.attr('rel').toLowerCase() === 'alternate';
}

function getAssets($cheerio) {
    let assets = {
        stylesheets: getStylesheets($cheerio),
        images: getImages($cheerio).concat(getIcons($cheerio)),
        scripts: getScripts($cheerio),
    };
    return assets;
}

function getScripts($cheerio) {
    let results = [];
    $cheerio('script').each((index, element) => {
        const $el = $cheerio(element);
        const src = $el.attr('src');
        if (!isUndefined(src)) {
            results.push(src);
        }
    });
    return results;
}

function getImages($cheerio) {
    let results = [];
    $cheerio('img').each((index, element) => {
        const $el = $cheerio(element);
        const src = $el.attr('src');
        if (!isUndefined(src)) {
            results.push(src);
        }
    });
    return results;
}

function getIcons($cheerio) {
    let results = [];
    $cheerio('link').each((index, element) => {
        const $el = $cheerio(element);
        if (isIcon($el)) {
            const href = $el.attr('href');
            if (!isUndefined(href)) {
                results.push(href);
            }
        }
    });
    return results;
}

function isIcon(element) {
    return element.attr('rel') && element.attr('rel').toLowerCase() === 'icon';
}

function getStylesheets($cheerio) {
    let results = [];
    $cheerio('link').each((index, element) => {
        const $el = $cheerio(element);
        if (isStylesheet($el)) {
            const href = $el.attr('href');
            if (!isUndefined(href)) {
                results.push(href);
            }
        }
    });
    return results;
}

function isStylesheet(element) {
    return element.attr('rel') && element.attr('rel').toLowerCase() === 'stylesheet';
}