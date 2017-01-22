import RequestProcessor from '../../src/crawler/request-processor';

describe('Request processor', function () {
    it('creates an instance', function () {
        const requestProcessor = new RequestProcessor();
        expect(requestProcessor).toBeTruthy();
    });
});