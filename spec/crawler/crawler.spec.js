import Crawler from '../../src/crawler';

describe('Crawler', function () {
    it('creates an instance', function () {
        const crawler = new Crawler();
        expect(crawler).toBeTruthy();
    });
    it('throws when their is no domain', function () {
        let createFn = () => {
            let crawler = new Crawler({ startUrl: 'some silly url' });
        }
        expect(createFn).toThrow(new Error('Invalid start url: some silly url. Could not extract the domain'));
    });
});