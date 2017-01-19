import Crawler from './crawler';

const crawlerOptions = {
    startUrl: 'https://gocardless.com/',
    maxDepth: 10,
};

const crawler = new Crawler(crawlerOptions);
crawler.start();