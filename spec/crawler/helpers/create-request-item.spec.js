import { createRequestItem } from '../../../src/crawler/helpers';

describe('Create request item', function () {
    it('returns null when nothing is passed', function () {
        const requestItem = createRequestItem();
        expect(requestItem).toBe(null);
    });
    it('returns null when no url is passed', function () {
        const requestItem = createRequestItem(null, { url: 'http://google.com', depth: 0 });
        expect(requestItem).toBe(null);
    });
    it('returns null when no parent is passed', function () {
        const requestItem = createRequestItem('http://google.com');
        expect(requestItem).toBe(null);
    });
    it('returns null when the url is invalid', function () {
        const requestItem = createRequestItem('http://.com', { url: 'http://google.com', depth: 0 });
        expect(requestItem).toBe(null);
    });
    it('returns null when the parent is invalid', function () {
        const requestItem = createRequestItem('http://google.com', { url: 'http://google.com' });
        expect(requestItem).toBe(null);
    });
    it('returns a valid request item', function () {
        const requestItem = createRequestItem('http://google.com/images', { url: 'http://google.com', depth: 3 });
        const expected = {
            host: 'google.com',
            protocol: 'http',
            url: 'http://google.com/images',
            depth: 4,
            parent: { url: 'http://google.com', depth: 3 },
            retries: 0
        };
        expect(requestItem).toEqual(expected);
    });
});