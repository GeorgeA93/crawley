import { getDomain } from '../../../src/crawler/helpers';

describe('Get domain', function () {
    it('gets null from an undefined url', function () {
        const domain = getDomain();
        expect(domain).toBe(null);
    });
    it('gets null from an empty url', function () {
        const url = '';
        const domain = getDomain(url);
        expect(domain).toBe(null);
    });
    it('gets null from an invalid url', function () {
        const url = 'hello world';
        const domain = getDomain(url);
        expect(domain).toBe(null);
    });
    it('can get domain from url', function () {
        const url = 'https://gocardless.com/';
        const domain = getDomain(url);
        expect(domain).toBe('gocardless.com');
    });
});