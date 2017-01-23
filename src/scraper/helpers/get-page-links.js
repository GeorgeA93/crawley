import { isUndefined } from 'lodash';

/**
 * Gets all the links that are on a html page
 * 
 * @export
 * @param {any} $cheerio The cheerio instance containing the html to search in
 * @returns {string[]} An array containing all of the page links, otherwise an empty array.
 */
export default function getPageLinks($cheerio) {
    if (!$cheerio) {
        return [];
    }
    return getAnchorTags($cheerio).concat(getAlternates($cheerio));
}

/**
 * 
 * Finds links by looking for anchor tags within the html
 * 
 * @param {any} $cheerio The cheerio instance containing the html to search in
 * @returns {string[]} The links found in the html
 */
function getAnchorTags($cheerio) {
    let results = [];
    $cheerio('a').each((index, element) => { // loop over all of the anchor tags
        const $el = $cheerio(element);
        const href = $el.attr('href'); // grab the href from the tag
        if (!isUndefined(href)) {
            results.push(href); // add it to the results array
        }
    });
    return results;
}

/**
 * 
 * Finds links by looking for alternate resources.
 * These are typically used for different language versions of a website
 * 
 * @param {any} $cheerio The cheerio instance containing the html to search in
 * @returns {string[]} The links found in the html
 */
function getAlternates($cheerio) {
    let results = [];
    $cheerio('link').each((index, element) => { // find all the link tags
        const $el = $cheerio(element);
        if (isAlternate($el)) { // if the tag is an alternate resource
            const href = $el.attr('href'); // grab the href from the tag
            if (!isUndefined(href)) {
                results.push(href); // add it to our results
            }
        }
    });
    return results;
}


/**
 * 
 * Checks whether an element is a link to an alternate resources.
 * 
 * @param {any} element The element to check.
 * @returns {boolean} True if the element is an alternate, otherwise false.
 */
function isAlternate(element) {
    return element.attr('rel') && element.attr('rel').toLowerCase() === 'alternate';
}