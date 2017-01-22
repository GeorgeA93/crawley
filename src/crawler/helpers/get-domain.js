import isValidUrl from './valid-url';

import uri from 'urijs';

/**
 * Gets the domain from a url
 * 
 * @export
 * @param {string} url the urls whose domain to get
 * @returns {string} the domain of the url
 */
export default function getDomain(url) {
    if (!isValidUrl(url)) { // we can only grab the domain from valid urls
        return null;
    }
    try {
        const domain = uri(url).normalize().host();
        if (!domain || domain === '') { // ensure the domain exists
            return null;
        }
        return domain;
    } catch (error) {
        return null;
    }
}