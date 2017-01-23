import contentType from 'content-type';
import { keys } from 'lodash';

const contentTypeHeader = 'content-type';
const htmlType = 'text/html';

/**
 * Determines whether a HTTP response contains HTML
 * 
 * @export
 * @param {any} response The HTTP response to check
 * @returns {boolean} True if the response contains html, otherwise false.
 */
export default function isHtml(response) {
    const result = parseContentType(response); // parse the content type of the response
    if (!result) { // if we coulnt parse the content type, it cannot be html
        return false;
    }
    return result.type === htmlType; // the content type must equal the htmlType
}

/***
 * Parses the content type from the responses headers
 * 
 * @param {any} response The HTTP response whose headers to parse
 * @returns {any} An object containing the parsed content type
 */
function parseContentType(response) {
    if (hasHeaders(response)) { // we can only parses responses that have headers
        return contentType.parse(response.headers[contentTypeHeader]);
    }
    return null;
}

/***
 * 
 * Determines whether a HTTP response has valid headers
 * 
 * @param {any} response The http response whose headers to check
 * @return {boolean} True if the headers are valid, otherwise false.
 */
function hasHeaders(response) {
    return response &&
        response.headers &&
        response.headers[contentTypeHeader];
}