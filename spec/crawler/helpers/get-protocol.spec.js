import { getProtocol } from '../../../src/crawler/helpers';

describe('Get protocol', function () {
    it('gets null from an undefined url', function () {
        const protocol = getProtocol();
        expect(protocol).toBe(null);
    });
    it('gets null from an empty url', function () {
        const url = '';
        const protocol = getProtocol(url);
        expect(protocol).toBe(null);
    });
    it('gets null from an invalid url', function () {
        const url = 'hello world';
        const protocol = getProtocol(url);
        expect(protocol).toBe(null);
    });
    it('can get protocol from url', function () {
        const url = 'https://gocardless.com/';
        const protocol = getProtocol(url);
        expect(protocol).toBe('https');
    });
});