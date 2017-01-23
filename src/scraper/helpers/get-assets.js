import { isUndefined } from 'lodash';

/**
 * 
 * Attempts to find any assets on a html page.
 * 
 * @export
 * @param {any} $cheerio The cheerio instance where the html is loaded
 * @returns {any} An object containing arrays of stylesheets, images and scripts.
 */
export default function getAssets($cheerio) {
    const assets = {
        stylesheets: [],
        images: [],
        scripts: []
    };
    if ($cheerio) {
        assets.stylesheets = getStylesheets($cheerio);
        assets.images = getIcons($cheerio).concat(getImages($cheerio));
        assets.scripts = getScripts($cheerio);
    }
    return assets;
}


/**
 * Grabs all the scripts from a html page
 * 
 * @param {any} $cheerio The cheerio instance where the html is loaded
 * @returns {string[]} An array containing all of the links to the scripts on the page
 */
function getScripts($cheerio) {
    let results = [];
    $cheerio('script').each((index, element) => { // loop over every script tag
        const $el = $cheerio(element);
        const src = $el.attr('src'); // grab the src attribute
        if (!isUndefined(src)) {
            results.push(src); // add it to our results
        }
    });
    return results;
}

/**
 * Grabs all the images from a html page
 * 
 * @param {any} $cheerio The cheerio instance where the html is loaded
 * @returns {string[]} An array containing all of the links to the images on the page
 */
function getImages($cheerio) {
    let results = [];
    $cheerio('img').each((index, element) => { // loop over every image tag
        const $el = $cheerio(element);
        const src = $el.attr('src'); // grab the src attribute
        if (!isUndefined(src)) {
            results.push(src); // add it to our results
        }
    });
    return results;
}

/**
 * Grabs all the icons from a html page
 * 
 * @param {any} $cheerio The cheerio instance where the html is loaded
 * @returns {string[]} An array containing all of the links to the icons on the page
 */
function getIcons($cheerio) {
    let results = [];
    $cheerio('link').each((index, element) => { // loop over every link tag
        const $el = $cheerio(element);
        if (isIcon($el)) { // if the element is an icon
            const href = $el.attr('href'); // grab the href attribute
            if (!isUndefined(href)) {
                results.push(href); // add it to our results
            }
        }
    });
    return results;
}


/**
 * Determines whether an element is an icon or not
 * 
 * @param {any} element The element to check
 * @returns {boolean} True if an icon, otherwise false
 */
function isIcon(element) {
    return element.attr('rel') && element.attr('rel').toLowerCase() === 'icon';
}

/**
 * Grabs all the stylesheets from a html page
 * 
 * @param {any} $cheerio The cheerio instance where the html is loaded
 * @returns {string[]} An array containing all of the links to the stylesheets on the page
 */
function getStylesheets($cheerio) {
    let results = [];
    $cheerio('link').each((index, element) => { // loop over every link
        const $el = $cheerio(element);
        if (isStylesheet($el)) { // if the element is a stylesheet
            const href = $el.attr('href'); // grab the href attribute
            if (!isUndefined(href)) {
                results.push(href); // add it to our results
            }
        }
    });
    return results;
}


/**
 * Determines whether an element is a stylesheet or not
 * 
 * @param {any} element The element to check
 * @returns {boolean} True if a stylesheet, otherwise false.
 */
function isStylesheet(element) {
    return element.attr('rel') && element.attr('rel').toLowerCase() === 'stylesheet';
}