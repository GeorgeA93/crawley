import isValidUrl from './valid-url';

import uri from 'urijs';

/**
 * Gets the protocol from a url
 * 
 * @export
 * @param {string} url the urls whose protocol to get
 * @returns {string} the protocol of the url
 */
export default function getProtocol(url) {
    if (!isValidUrl(url)) { // we can only grab the protocol from valid urls
        return null;
    }
    try {
        const protocol = uri(url).normalize().protocol();
        if (!protocol || protocol === '') { // ensure the protocol exists
            return null;
        }
        return protocol;
    } catch (error) {
        return null;
    }
}