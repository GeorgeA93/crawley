import isValidUrl from './valid-url';

import uri from 'urijs';
import { isString } from 'lodash';

/**
 * Creates a request item from a url and a parent
 * 
 * @export
 * @param {string} url The url that we want to request
 * @param {any} parent This is an object containing a url and a depth. It represents the page where we found the url passed as the first argument
 * @returns The created request item or null if we failed to create one
 */
export default function createRequestItem(url, parent, robots = null) {
    if (!isValidParent(parent)) { // the parent must be valid
        return null;
    }

    try {
        let newUrl = uri(url).absoluteTo(parent.url).normalize(); // get the path to the url from the parent url
        if (!isValidUrl(newUrl.href())) { // the newUrl must be valid
            return null;
        }
        if (robots && robots.isDisallowed(newUrl.href())) { // if we are respecting the robots.txt and the url isDisallowed
            console.log(`Skipping ${newUrl.href()} as it is disallowed in the robots.txt`);
            return null;
        }
        return { // the new request item
            host: newUrl.hostname(),
            protocol: newUrl.protocol() || "http",
            url: newUrl.href(),
            depth: parent.depth + 1, // increment the depth
            parent: parent,
            retries: 0
        };
    } catch (error) {
        return null;
    }
}

/**
 * A parent object is valid if it isnt null, is has a url, and a depth greater than -1
 * 
 * @param {any} parent The parent object to check
 * @returns {boolean} True if the parent is valid, otherwise false
 */
function isValidParent(parent) {
    return parent &&
        parent.url &&
        isString(parent.url) &&
        parent.url.length > 0 &&
        parent.depth > -1;
}