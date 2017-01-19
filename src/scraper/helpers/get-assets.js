import { isUndefined } from 'lodash';

export default function getAssets($cheerio) {
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