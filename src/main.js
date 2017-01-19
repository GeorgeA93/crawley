import Crawler from './crawler';

const startUrl = 'https://gocardless.com';

const crawler = new Crawler(startUrl);
crawler.crawl();