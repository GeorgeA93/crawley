import { isString } from 'lodash';

import urlRegex from 'url-regex';

export default function isValidUrl(url) {
    if (!url) {
        return false;
    }
    return isString(url) &&
        url.length > 0 &&
        urlRegex().test(url);
}