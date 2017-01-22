import RequestQueue from '../../src/crawler/request-queue';

describe('Request queue', function () {

    let requestQueue = null;

    beforeEach(function () {
        requestQueue = new RequestQueue();
    });

    it('creates an instance', function () {
        expect(requestQueue).toBeTruthy();
    });
    it('cannot queue null', function () {
        requestQueue.enqueue(null);
        expect(requestQueue.size).toBe(0);
    });
    it('queues an item', function () {
        requestQueue.enqueue({ url: 'http://testing.com' });
        expect(requestQueue.size).toBe(1);
    });
    it('cannot queue duplicates', function () {
        requestQueue.enqueue({ url: 'http://testing.com' });
        requestQueue.enqueue({ url: 'http://testing.com' });
        expect(requestQueue.size).toBe(1);
    });
    it('can peak', function () {
        requestQueue.enqueue({ url: 'http://testing.com' });
        const requestItem = requestQueue.peek();
        expect(requestQueue.size).toBe(1);
        expect(requestItem).toEqual({ url: 'http://testing.com' });
    });
    it('can dequeue', function () {
        requestQueue.enqueue({ url: 'http://testing.com' });
        const requestItem = requestQueue.dequeue();
        expect(requestQueue.size).toBe(0);
        expect(requestItem).toEqual({ url: 'http://testing.com' });
    });
    it('can find contained items', function () {
        requestQueue.enqueue({ url: 'http://testing.com' });
        const result = requestQueue.contains({ url: 'http://testing.com' });
        expect(result).toBe(true);
    });
    it('doesnt find non contained items', function () {
        requestQueue.enqueue({ url: 'http://testing.com' });
        const result = requestQueue.contains({ url: 'http://a different url.com' });
        expect(result).toBe(false);
    });
    it('can clear', function () {
        requestQueue.enqueue({ url: 'http://testing.com' });
        requestQueue.clear();
        expect(requestQueue.size).toBe(0);
    });
});