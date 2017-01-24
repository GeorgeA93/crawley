import Crawler from '../../src/crawler';

describe('Crawler', function () {
    beforeEach(function (done) {
        done();
    }, 2000);
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
    it('can start', function (done) {
        const crawler = new Crawler();
        crawler.on('started', () => {
            done();
            crawler.stop();
        });
        crawler.start();
    });
    it('can stop', function (done) {
        const crawler = new Crawler();
        crawler.on('started', () => {
            crawler.stop();
        });
        crawler.on('finished', () => {
            done();
        });
        crawler.start();
    });
});