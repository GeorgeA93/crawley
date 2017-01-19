import { getPageLinks } from '../../../src/scraper/helpers';

import cheerio from 'cheerio';

describe('Get page links', function () {
    it('returns an empty array when the html is null', function () {
        const pageLinks = getPageLinks(null);
        expect(pageLinks.length).toBe(0);
    });
    it('returns an empty array when the html is an empty string', function () {
        const noHtml = cheerio.load('');
        const pageLinks = getPageLinks(noHtml);
        expect(pageLinks.length).toBe(0);
    });
    it('returns an empty array when there are no links', function () {
        const noLinks = cheerio.load(`
            <html>
                <p>HELLO WORLD</p>
                <div> 
                    <span>No links to see here</span>
                </div>
            </html>
        `);
        const pageLinks = getPageLinks(noLinks);
        expect(pageLinks.length).toBe(0);
    });
    it('returns links where there are anchor tags', function () {
        const linkOne = '/a/link/to/some/page';
        const linkTwo = '/a/link/to/another/page';
        const anchorTags = cheerio.load(`
            <html>
                <p>HELLO WORLD</p>
                <div> 
                    <span>There are some anchor tags here...</span>
                    <a href="${linkOne}">CLICK ME</a>
                    <p>But you must find them first...</p>
                </div>
                <a href="${linkTwo}">CLICK ME PLEASE</a>
            </html>
        `);
        const pageLinks = getPageLinks(anchorTags);
        expect(pageLinks.length).toBe(2);
        expect(pageLinks[0]).toEqual(linkOne);
        expect(pageLinks[1]).toEqual(linkTwo);
    });
    it('returns links where there are alternate resources', function () {
        const link = '/link/to/some/resource';
        const alternateResources = cheerio.load(`
            <html>
                <link rel="alternate" href="${link}">
                <p>HELLO WORLD</p>
                <div> 
                    <span>There are not anchor tags here...</span>
                    <p>But you must find them first...</p>
                </div>
            </html>
        `);
        const pageLinks = getPageLinks(alternateResources);
        expect(pageLinks.length).toBe(1);
        expect(pageLinks[0]).toEqual(link);
    });
    it('returns links where there are alternate resources and anchor tags', function () {
        const linkOne = '/a/link/to/some/page';
        const linkTwo = '/a/link/to/another/page';
        const resource = '/link/to/some/resource';
        const anchorTagsAndResources = cheerio.load(`
            <html>
              <link rel="alternate" href="${resource}">
                <p>HELLO WORLD</p>
                <div> 
                    <span>There are some anchor tags here...</span>
                    <a href="${linkOne}">CLICK ME</a>
                    <p>But you must find them first...</p>
                </div>
                <a href="${linkTwo}">CLICK ME PLEASE</a>
            </html>
        `);
        const pageLinks = getPageLinks(anchorTagsAndResources);
        expect(pageLinks.length).toBe(3);
        expect(pageLinks[0]).toEqual(linkOne);
        expect(pageLinks[1]).toEqual(linkTwo);
        expect(pageLinks[2]).toEqual(resource);
    });
});