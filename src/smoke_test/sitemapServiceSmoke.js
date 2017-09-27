//HACK: supertest doesn't support ES6 yet
var nconf = require('nconf');
nconf.argv().env();
var request = require('supertest');
var baseUrl = nconf.get('URL');
const assert = require('chai').assert;
var schemas  = require("./util/schemas.js");

const app = baseUrl;

console.log('running on url :: ' + baseUrl);

describe('Smoke test of sitemap service', function() {
    this.retries(4);

    it('respond with APP NAME', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .expect(function(res) {
                if (res.text !== 'SITEMAP_SERVICE') throw new Error("ERROR");
            })
            .end(done);
    });

    it('want to get index sitemap for dolly', function(done) {
        request(app)
            .get('/v1/dolly')
            .expect(function(res) {
                const result = res.text;
                assert.include(result, `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/win</loc></sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/video</loc></sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/lifestyle</loc></sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/beauty</loc></sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/site</loc></sitemap><sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/celebrity</loc></sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/fashion</loc></sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/sitemap/dolly-doctor</loc></sitemap>`);
                assert.include(result, `<sitemap><loc>http://dev.dolly-site.bauer-media.net.au/news</loc></sitemap>`);
            })
            .end(done);
    });

    it('want to get section sitemap for dolly', function(done) {
        request(app)
            .get('/v1/dolly/win')
            .expect(function(res) {
                const result = res.text;
                assert.include(result, schemas.sitemapSectionHeaderSchema());
                assert.include(result, schemas.sitemapSectionBodySchema());
            })
            .end(done);
    });


});