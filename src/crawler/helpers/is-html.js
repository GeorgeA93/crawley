import contentType from 'content-type';
import { keys } from 'lodash';

const contentTypeHeader = 'content-type';
const htmlType = 'text/html';

export default function isHtml(response) {
    const result = parseContentType(response);
    if (!result) {
        return false;
    }
    return result.type === htmlType;
}

function parseContentType(response) {
    if (hasHeaders(response)) {
        return contentType.parse(response.headers[contentTypeHeader]);
    }
    return null;
}

function hasHeaders(response) {
    return response &&
        response.headers &&
        response.headers[contentTypeHeader];
}