import Crawler from '../dist';
import fs from 'fs';

const crawlerOptions = {
    startUrl: 'https://gocardless.com/',
    maxDepth: 2,
    maxConcurrentRequests: 4,
    maxRetryCount: 2,
};

const crawler = new Crawler(crawlerOptions);
crawler.start();
crawler.on('finished', (results, errors) => {
    fs.writeFileSync('results/results.json', JSON.stringify(results, null, 2));
    fs.writeFileSync('results/errors.json', JSON.stringify(errors, null, 2));
    checkForDupes(results);
});

function checkForDupes(results) {
    let dupes = [];
    for (var i = 0; i < results.length; i++) {
        const res = results[i];
        for (var j = 0; j < results.length; j++) {
            if (i === j) { continue; }
            const c = results[j];
            if (res.url === c.url) {
                dupes.push(res);
            }
        }
    }
    fs.writeFileSync('results/dupes.json', JSON.stringify(dupes, null, 2));
    console.log(`${dupes.length} Duplicates`);
}
