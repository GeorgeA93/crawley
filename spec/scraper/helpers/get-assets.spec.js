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
        const html = cheerio.load(`
            <html>
                <link rel="icon" href="/path/to/icon.png" />
                <link rel="stylesheet" href="/path/to/styles.css" />
                <link rel="stylesheet" href="/path/to/bootstrap.css" />
                <script src="/path/to/script.js"></script>
                <p>HELLO WORLD</p>
                <div> 
                    <span>Find the assets!!</span>
                </div>
                <div>
                    <p>Here lie images</p>
                    <h1>If you can find them</h1>
                    <div>
                        <img src="path/to/image.jpg" />
                        <div>
                            <img src="path/to/image1.png" />                            
                            <img src="path/to/image2.png" />                            
                        </div>
                    </div>
                </div>
                <script src="bundle.js"></script>
                <link rel="stylesheet" href="/path/to/bundle.css" />                
            </html>
        `);
        const assets = getAssets(html);
        expect(assets.stylesheets.length).toBe(3);
        expect(assets.images.length).toBe(4);
        expect(assets.scripts.length).toBe(2);
    });
});