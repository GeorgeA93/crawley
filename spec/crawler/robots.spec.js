import Robots from '../../src/crawler/robots';

describe('Robots', function () {
    let robots = null;
    beforeEach(function (done) {
        robots = new Robots();
        done();
    }, 2000);
    it('creates an instance', function () {
        expect(robots).toBeTruthy();
    });
    it('can set url', function (done) {
        robots.setUrl('http://gocardless.com', (error) => {
            expect(error).toBe(null);
            done();
        });
    });
    it('doesnt set url when there is not robots.txt', function (done) {
        robots.setUrl('http://example.com', (error) => {
            expect(error).toBeTruthy();
            done();
        });
    });
    it('doesnt get a crawl delay when there isnt one in the robots.txt', function (done) {
        robots.setUrl('http://gocardless.com', (error) => {
            const delay = robots.getCrawlDelay();
            expect(delay).toBe(null);
            done();
        });
    });
    it('can get crawl-delay', function (done) {
        robots.setUrl('http://twitter.com', (error) => {
            const delay = robots.getCrawlDelay();
            expect(delay > 0).toBeTruthy();
            done();
        });
    });
    it('can disallow', function (done) {
        robots.setUrl('http://gocardless.com', (error) => {
            const result = robots.isDisallowed('http://gocardless.com/merchants/');
            expect(result).toBe(true);
            done();
        });
    });
    it('doesnt disallow valid urls', function (done) {
        robots.setUrl('http://gocardless.com', (error) => {
            const result = robots.isDisallowed('http://gocardless.com/developers/');
            expect(result).toBe(false);
            done();
        });
    });
});