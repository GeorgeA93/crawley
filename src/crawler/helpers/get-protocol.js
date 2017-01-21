import isValidUrl from './valid-url';

import uri from 'urijs';

export default function getProtocol(url) {
    if (!isValidUrl(url)) {
        return null;
    }
    try {
        return uri(url).normalize().protocol();
    } catch (error) {
        return null;
    }
}