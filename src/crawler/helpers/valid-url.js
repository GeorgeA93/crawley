import { isString } from 'lodash';

import urlRegex from 'url-regex';

/**
 * Detemines whether a url is valid.
 * 
 * @export
 * @param {string} url
 * @returns {boolean} True if valid, otherwise false.
 */
export default function isValidUrl(url) {
    if (!url) { // we must have a url
        return false;
    }
    return isString(url) && // it must be a string
        url.length > 0 && // it cannot be empty
        urlRegex().test(url); // it must match the url regex
}