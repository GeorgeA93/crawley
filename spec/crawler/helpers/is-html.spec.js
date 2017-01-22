import { isHtml } from '../../../src/crawler/helpers';

describe('Is html', function () {
    it('returns false when no response is passed', function () {
        const result = isHtml();
        expect(result).toBe(false);
    });
    it('returns false when no headers are in the response', function () {
        const response = {};
        const result = isHtml(response);
        expect(result).toBe(false);
    });
    it('returns false when missing content type', function () {
        const response = {
            headers: {
            }
        };
        const result = isHtml(response);
        expect(result).toBe(false);
    });
    it('returns false with invalid content-type', function () {
        const response = {
            headers: {
                "content-type": 'text/plain'
            }
        };
        const result = isHtml(response);
        expect(result).toBe(false);
    });
    it('returns true with valid content-type', function () {
        const response = {
            headers: {
                "content-type": 'text/html'
            }
        };
        const result = isHtml(response);
        expect(result).toBe(true);
    });
});