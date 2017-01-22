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
2. Move to where you want to save the repository
```
cd Path/Where/You/Want/Crawley
```
3. Clone the repository
```
git clone https://github.com/GeorgeA93/crawley.git
```
4. Move to the cloned folder
```
cd crawley
```
5. Install the dependencies
```
yarn
```
6. Run!
```
yarn start
```

Running `yarn start` will first run the tests, then build the distrubition and finally run the example found in `examples/gocardless.js`

To change the example that is running, open the `package.json` and change the following line:
```
"start": "babel-node examples/gocardless.js",
```
to:
```
"start": "babel-node examples/<NAME-OF-THE-EXAMPLE>.js",
```
where `<NAME-OF-THE-EXAMPLE>` is the name of the example you want to run without the `'<'` and `'>'` characters.

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

