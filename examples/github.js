import Crawler from '../dist';
import fs from 'fs';

const crawlerOptions = {
    startUrl: 'https://github.com/',
    maxDepth: 2,
    maxConcurrentRequests: 4,
    maxRetryCount: 0,
    requestInterval: 50
};

const crawler = new Crawler(crawlerOptions);
crawler.start();
crawler.on('finished', (results, errors) => {
    console.log(results);
    fs.writeFileSync('results/results-github.json', JSON.stringify(results, null, 2));
    fs.writeFileSync('results/errors-github.json', JSON.stringify(errors, null, 2));
});