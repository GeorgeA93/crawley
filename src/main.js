import Crawler from './crawler';
import fs from 'fs';

const crawlerOptions = {
    startUrl: 'https://gocardless.com/',
    maxDepth: 0,
    maxConcurrentRequests: 1,
    maxRetryCount: 2,
    requestTimeout: 4000,
    requestInterval: 20
};

const crawler = new Crawler(crawlerOptions);
crawler.start();
crawler.on('finished', (results, errors) => {
    fs.writeFileSync('results/results.json', JSON.stringify(results, null, 2));
    fs.writeFileSync('results/errors.json', JSON.stringify(errors, null, 2));
});
