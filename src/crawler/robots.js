import robotsParser from 'robots-parser';
import request from 'request';

export default class Robots {

    /**
     * Creates an instance of Robots.
     * 
     * 
     * @memberOf Robots
     */
    constructor() {
        this._robotsPath = '/robots.txt';
        this._userAgent = '*';
    }

    /**
     * Sets the robots.txt url and parses the robots.txt file
     * 
     * @param {any} url The base url
     * @param {any} completion completion callback
     * 
     * @memberOf Robots
     */
    setUrl(url, completion) {
        const robotsUrl = `${url}${this._robotsPath}`
        request.get(robotsUrl, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                completion(new Error('Failed to fetch robots.txt'));
            } else {
                this._parser = robotsParser(robotsUrl, body);
                completion(null);
            }
        });
    }

    /**
     * Attempts to get the crawl-delay from the robots.txt file
     * 
     * @returns {number} The crawl delay in milliseconds
     * 
     * @memberOf Robots
     */
    getCrawlDelay() {
        const crawlDelay = this._parser.getCrawlDelay(this._userAgent);
        return crawlDelay ? crawlDelay * 1000 : null;
    }

    /**
     * Checks wether a url is disallowed in the robots.txt
     * 
     * @param {any} url The url to check
     * @returns {boolean} True if disallowed, otherwise false
     * 
     * @memberOf Robots
     */
    isDisallowed(url) {
        return this._parser.isDisallowed(url, this._userAgent);
    }

}