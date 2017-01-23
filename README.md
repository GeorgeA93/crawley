# crawley - A simple nodejs web crawler

[![npm version](https://badge.fury.io/js/crawley.svg)](https://badge.fury.io/js/crawley)

Crawley will crawl a website and return to you a list of all the discovered pages, as well the paths to all of the assets on said page. Including javascript, css and images.

## Installation - To use in your own projects

#### Using yarn:
`yarn add crawley`

#### Using npm
`npm install crawley --save`

## Running the examples (macOS Sierra)

#### Requirements:
1. macOS Sierra (currently not tested on any other OS, however i cannot see why it wouldn't work)
2. Git
3. Node version 4.5.0 or greater
4. Yarn. can be installed [here](https://yarnpkg.com/en/docs/install) (this will also install node)

#### Steps:
1. Open a terminal
2. Move to where you want to save the repository `cd Path/Where/You/Want/Crawley`
3. Clone the repository `git clone https://github.com/GeorgeA93/crawley.git`
4. Move to the cloned folder `cd crawley`
5. Install the dependencies `yarn`
6. Run! `yarn start`

Running `yarn start` will first run the tests, then build the distrubition and finally run the example found in `examples/gocardless.js`

The `gocardless.js` example crawls https://gocardless.com/ with a max-depth of 0. This means it will only stop when it cannot find any more URL's to crawl and scrape.

When the example has finished running, the results are written to the console and saved in a file called `results/results-gocardless.json`. You can also view any errors that occurred in the `results/errors-gocardless.json` file. After saving the results and the errors, it also checks for any duplicate URL's. These can be found in `results/dupes-gocardless.json`. This file should be empty! (the crawler ignores URL's that it has seen before)

To change the example that is running, open the `package.json` and change the following line:
```
"start": "babel-node examples/gocardless.js",
```
to:
```
"start": "babel-node examples/<NAME-OF-THE-EXAMPLE>.js",
```
where `<NAME-OF-THE-EXAMPLE>` is the name of the example you want to run without the `'<'` and `'>'` characters.

## Crawler Options

The crawler constructor takes an object containing many options. These options are explained below.

| Option                	| Description                                                     	| Default Value          	|
|-----------------------	|-----------------------------------------------------------------	|------------------------	|
| startUrl              	| The url to start the crawl from                                 	| http://www.example.com 	|
| maxDepth              	| The maximum depth of the crawl. If 0, the depth isn't limited   	| 0                      	|
| maxConcurrentRequests 	| The maximum number of HTTP to process at once                   	| 4                      	|
| requestInterval       	| The interval between each iteration of the crawl loop.          	| 250                    	|
| sameDomain            	| If true, crawling has to be on the same domain as the start url 	| true                   	|
| sameProtocol          	| If true, crawling has to use the same protocol as the start url    	| true                   	|
| requestTimeout        	| The maximum amount of time to wait for a request                	| 10000                  	|
| maxRetryCount         	| The number of times a request can be retried                    	| 1                      	|
| maxResultSize         	| The maximum number of results too accept.                       	| 200000                 	|
| maxQueueSize          	| The maximum number of items that can be in the queue            	| 200000                 	|

## Crawler Events

| Event    	| Example                                                       	| Description                                                                	|
|----------	|---------------------------------------------------------------	|----------------------------------------------------------------------------	|
| started  	| `crawler.on('started', () => {});`                            	| Emitted when the crawler has started                                       	|
| finished 	| `crawler.on('finished', (results, errors) => {});`            	| Emitted when the crawler has finished, or reached the maximum results size. Results is an array containing all of the succesfully crawled and scraped pages. Errors is an object containing all of the failed urls. 	|
| page     	| `crawler.on('page', (requestItem, pageLinks, assets) => {});` 	| Emitted when the crawler has successfully crawled a page. The requestItem is an object containing information about the page that was crawled, pageLinks is an array of all the urls found on the page and assets is an object containing all of the assets found on the page.                  	|

## Other scripts

#### Testing
To just run the tests, use the following command:
```
yarn test
```

#### 'Development' mode
To run in development mode, a mode that reloads when a file changes, fun the following command:
```
yarn run dev
```

#### Building
To build a new distrubition run the following command:
```
yarn run build
```

