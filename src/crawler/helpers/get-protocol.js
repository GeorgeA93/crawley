import isValidUrl from './valid-url';

import uri from 'urijs';

export default function getProtocol(url) {
    if (!isValidUrl(url)) {
        return null;
    }
    try {
        const protocol = uri(url).normalize().protocol();
        if (!protocol || protocol === '') {
            return null;
        }
        return protocol;
    } catch (error) {
        return null;
    }
}