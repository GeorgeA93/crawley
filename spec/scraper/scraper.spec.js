import Scraper from '../../src/scraper';

describe('Scraper', function () {
    it('creates an instance', function () {
        const scraper = new Scraper();
        expect(scraper).toBeTruthy();
    });
    it('has a function called scrape', function () {
        const scraper = new Scraper();
        expect(scraper.scrape).toBeTruthy();
    });
    it('can scrape undefined', function () {
        const scraper = new Scraper();
        const {assets, pageLinks} = scraper.scrape();
        expect(assets.images.length).toBe(0);
        expect(assets.stylesheets.length).toBe(0);
        expect(assets.scripts.length).toBe(0);
        expect(pageLinks.length).toBe(0);
    });
    it('can scrape null', function () {
        const scraper = new Scraper();
        const {assets, pageLinks} = scraper.scrape(null);
        expect(assets.images.length).toBe(0);
        expect(assets.stylesheets.length).toBe(0);
        expect(assets.scripts.length).toBe(0);
        expect(pageLinks.length).toBe(0);
    });
    it('can scrape assets and pageLinks', function () {
        const scraper = new Scraper();
        const stylesheetOne = '/path/to/styles.css';
        const stylesheetTwo = '/path/to/bootstrap.css';
        const stylesheetThree = '/path/to/bundle.css';
        const imageOne = '/path/to/icon.png';
        const imageTwo = 'path/to/image.jpg';
        const imageThree = 'path/to/image1.png';
        const imageFour = 'path/to/image2.png';
        const scriptOne = '/path/to/script.js';
        const scriptTwo = 'bundle.js';
        const linkOne = '/a/link/to/some/page';
        const linkTwo = '/a/link/to/another/page';
        const resource = '/link/to/some/resource';
        const html = `
            <html>
                <link rel="icon" href="${imageOne}" />
                <link rel="stylesheet" href="${stylesheetOne}" />
                <link rel="stylesheet" href="${stylesheetTwo}" />
                <script src="${scriptOne}"></script>
                 <link rel="alternate" href="${resource}" />
                <p>HELLO WORLD</p>
                <div> 
                    <span>Find the assets!!</span>
                </div>
                <div>
                    <p>Here lie images</p>
                    <h1>If you can find them</h1>
                    <div>
                        <a href="${linkOne}">CLICK ME</a>
                            <div>
                                <img src="${imageTwo}" />
                                <div>
                                    <img src="${imageThree}" />                            
                                    <img src="${imageFour}" />                            
                                </div>
                            </div>
                    </div>
                </div>
                <a href="${linkTwo}">CLICK ME PLEASE</a>
                <script src="${scriptTwo}"></script>
                <link rel="stylesheet" href="${stylesheetThree}" />       
            </html>
        `;
        const {assets, pageLinks} = scraper.scrape(html);
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
        expect(pageLinks.length).toBe(3);
        expect(pageLinks[0]).toEqual(linkOne);
        expect(pageLinks[1]).toEqual(linkTwo);
        expect(pageLinks[2]).toEqual(resource);
    });
});