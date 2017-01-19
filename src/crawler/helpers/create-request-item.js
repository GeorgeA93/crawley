import isValidUrl from './valid-url';

import uri from 'urijs';
import { isString } from 'lodash';

export default function createRequestItem(url, parent) {
    if (!isValidUrl(url) || !isValidParent(parent)) {
        return null;
    }

    try {
        let newUrl = uri(url).absoluteTo(parent.url).normalize();
        return {
            host: newUrl.hostname(),
            path: newUrl.resource(),
            port: newUrl.port(),
            protocol: newUrl.protocol() || "http",
            uriPath: newUrl.path(),
            url: newUrl.href(),
            depth: parent.depth + 1,
            parent: parent,
            fetched: false,
        };
    } catch (error) {
        return null;
    }
}

function isValidParent(parent) {
    return parent &&
        parent.url &&
        isString(parent.url) &&
        parent.url.length > 0 &&
        parent.depth > -1;
}