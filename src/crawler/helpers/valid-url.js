import { isString } from 'lodash';

export default function isValidUrl(url) {
    return url &&
        isString(url) &&
        url.length > 0;
}