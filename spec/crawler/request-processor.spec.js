import RequestProcessor from '../../src/crawler/request-processor';

describe('Request processor', function () {
    it('creates an instance', function () {
        const requestProcessor = new RequestProcessor();
        expect(requestProcessor).toBeTruthy();
    });
    it('can rety a request item', function () {
        const requestProcessor = new RequestProcessor({
            maxRetryCount: 1
        });
        const requestItem = {
            retries: 0
        };
        const result = requestProcessor._canRetry(requestItem);
        expect(result).toBe(true);
    });
    it('cannot retry a request item whose reties exceed the maxRetryCount', function () {
        const requestProcessor = new RequestProcessor({
            maxRetryCount: 1
        });
        const requestItem = {
            retries: 1
        };
        const result = requestProcessor._canRetry(requestItem);
        expect(result).toBe(false);
    });
    it('adds a retry to the queue', function () {
        const requestProcessor = new RequestProcessor({
            maxRetryCount: 1
        });
        const requestItem = {
            retries: 0
        };
        const result = requestProcessor._retry(requestItem);
        expect(result).toBe(true);
        expect(requestProcessor.remainingRequests()).toBe(1);
    });
    it('doesnt add a retry to the queue when it exceeds the maxRetryCount', function () {
        const requestProcessor = new RequestProcessor({
            maxRetryCount: 1
        });
        const requestItem = {
            retries: 1
        };
        const result = requestProcessor._retry(requestItem);
        expect(result).toBe(false);
        expect(requestProcessor.remainingRequests()).toBe(0);
    });
    it('can process', function () {
        const requestProcessor = new RequestProcessor({
            maxConcurrentRequests: 1
        });
        const requestItem = {};
        const result = requestProcessor._canProcess(requestItem);
        expect(result).toBe(true);
    });
    it('can accept response', function () {
        const requestProcessor = new RequestProcessor();
        const response = {
            statusCode: 200,
            headers: {
                "content-type": 'text/html'
            }
        };
        const result = requestProcessor._acceptResponse(response);
        expect(result).toBe(true);
    });
    it('cannot accept invalid status codes response', function () {
        const requestProcessor = new RequestProcessor();
        const response = {
            statusCode: 404,
            headers: {
                "content-type": 'text/html'
            }
        };
        const result = requestProcessor._acceptResponse(response);
        expect(result).toBe(false);
    });
    it('cannot accept invalid content types', function () {
        const requestProcessor = new RequestProcessor();
        const response = {
            statusCode: 200,
            headers: {
                "content-type": 'text/plain'
            }
        };
        const result = requestProcessor._acceptResponse(response);
        expect(result).toBe(false);
    });
    it('cannot queue invalid request items', function () {
        const requestProcessor = new RequestProcessor();
        const result = requestProcessor._canQueue({});
        expect(result).toBe(false);
    });
});