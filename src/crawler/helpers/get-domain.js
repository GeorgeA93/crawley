import isValidUrl from './valid-url';

import uri from 'urijs';

export default function getDomain(url) {
    if (!isValidUrl(url)) {
        return null;
    }
    try {
        return uri(url).normalize().host();
    } catch (error) {
        return null;
    }
}