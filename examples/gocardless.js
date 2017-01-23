import Crawler from '../dist';
import fs from 'fs';

const crawlerOptions = {
    startUrl: 'https://gocardless.com/',
    maxDepth: 4,
    maxConcurrentRequests: 2,
    maxRetryCount: 2,
};

const crawler = new Crawler(crawlerOptions);
crawler.start();
crawler.on('finished', (results, errors) => {
    console.log(results);
    fs.writeFileSync('results/results-gocardless.json', JSON.stringify(results, null, 2));
    fs.writeFileSync('results/errors-gocardless.json', JSON.stringify(errors, null, 2));
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
    fs.writeFileSync('results/dupes-gocardless.json', JSON.stringify(dupes, null, 2));
    console.log(`${dupes.length} Duplicates`);
}
