import { isUndefined } from 'lodash';

export default function getPageLinks($cheerio) {
    return getAnchorTags($cheerio).concat(getAlternates($cheerio));
}

function getAnchorTags($cheerio) {
    let results = [];
    $cheerio('a').each((index, element) => {
        const $el = $cheerio(element);
        const href = $el.attr('href');
        if (!isUndefined(href)) {
            results.push(href);
        }
    });
    return results;
}

function getAlternates($cheerio) {
    let results = [];
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