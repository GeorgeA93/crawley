import { isValidUrl } from '../../../src/crawler/helpers';

describe('Valid url', function () {
    it('returns false when no url is passed', function () {
        const result = isValidUrl();
        expect(result).toBe(false);
    });
    it('returns false when an empty url is passed', function () {
        const result = isValidUrl('');
        expect(result).toBe(false);
    });
    it('returns false when an invalid url is passed', function () {
        const result = isValidUrl('/google.co.uk');
        expect(result).toBe(false);
    });
    it('returns true when a valid url is passed', function () {
        const result = isValidUrl('https://www.google.co.uk');
        expect(result).toBe(true);
    });
});