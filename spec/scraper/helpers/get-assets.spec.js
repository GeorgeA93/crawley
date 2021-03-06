import { getAssets } from '../../../src/scraper/helpers';

import cheerio from 'cheerio';

describe('Get assets', function () {
    it('returns empty arrays when the html is undefined', function () {
        const assets = getAssets(undefined);
        expect(assets.stylesheets.length).toBe(0);
        expect(assets.images.length).toBe(0);
        expect(assets.scripts.length).toBe(0);
    });
    it('returns empty arrays when the html is null', function () {
        const assets = getAssets(null);
        expect(assets.stylesheets.length).toBe(0);
        expect(assets.images.length).toBe(0);
        expect(assets.scripts.length).toBe(0);
    });
    it('returns empty arrays when the html is an empty string', function () {
        const assets = getAssets(cheerio.load(''));
        expect(assets.stylesheets.length).toBe(0);
        expect(assets.images.length).toBe(0);
        expect(assets.scripts.length).toBe(0);
    });
    it('returns empty arrays when their are no assets', function () {
        const html = cheerio.load(`
            <html>
                <p>HELLO WORLD</p>
                <div> 
                    <span>No assets to see here</span>
                </div>
            </html>
        `);
        const assets = getAssets(html);
        expect(assets.stylesheets.length).toBe(0);
        expect(assets.images.length).toBe(0);
        expect(assets.scripts.length).toBe(0);
    });
    it('returns the correct amount of assets', function () {
        const stylesheetOne = '/path/to/styles.css';
        const stylesheetTwo = '/path/to/bootstrap.css';
        const stylesheetThree = '/path/to/bundle.css';
        const imageOne = '/path/to/icon.png';
        const imageTwo = 'path/to/image.jpg';
        const imageThree = 'path/to/image1.png';
        const imageFour = 'path/to/image2.png';
        const scriptOne = '/path/to/script.js';
        const scriptTwo = 'bundle.js';
        const html = cheerio.load(`
            <html>
                <link rel="icon" href="${imageOne}" />
                <link rel="stylesheet" href="${stylesheetOne}" />
                <link rel="stylesheet" href="${stylesheetTwo}" />
                <script src="${scriptOne}"></script>
                <p>HELLO WORLD</p>
                <div> 
                    <span>Find the assets!!</span>
                </div>
                <div>
                    <p>Here lie images</p>
                    <h1>If you can find them</h1>
                    <div>
                        <img src="${imageTwo}" />
                        <div>
                            <img src="${imageThree}" />                            
                            <img src="${imageFour}" />                            
                        </div>
                    </div>
                </div>
                <script src="${scriptTwo}"></script>
                <link rel="stylesheet" href="${stylesheetThree}" />                
            </html>
        `);
        const assets = getAssets(html);
        expect(assets.stylesheets.length).toBe(3);
        expect(assets.images.length).toBe(4);
        expect(assets.scripts.length).toBe(2);
        expect(assets.stylesheets[0]).toEqual(stylesheetOne);
        expect(assets.stylesheets[1]).toEqual(stylesheetTwo);
        expect(assets.stylesheets[2]).toEqual(stylesheetThree);
        expect(assets.images[0]).toEqual(imageOne);
        expect(assets.images[1]).toEqual(imageTwo);
        expect(assets.images[2]).toEqual(imageThree);
        expect(assets.images[3]).toEqual(imageFour);
        expect(assets.scripts[0]).toEqual(scriptOne);
        expect(assets.scripts[1]).toEqual(scriptTwo);

    });
});