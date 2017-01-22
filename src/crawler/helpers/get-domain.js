import isValidUrl from './valid-url';

import uri from 'urijs';

export default function getDomain(url) {
    if (!isValidUrl(url)) {
        return null;
    }
    try {
        const domain = uri(url).normalize().host();
        if (!domain || domain === '') {
            return null;
        }
        return domain;
    } catch (error) {
        return null;
    }
}