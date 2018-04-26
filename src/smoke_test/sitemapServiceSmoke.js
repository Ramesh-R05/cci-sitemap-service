//HACK: supertest doesn't support ES6 yet
var nconf = require('nconf');
nconf.argv().env();
var request = require('supertest');
var baseUrl = nconf.get('URL');
const assert = require('chai').assert;
var parser = require('xml2json');

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

    it('want to get index sitemap for NTL', function(done) {
        request(app)
            .get('/v1/now')
            .expect(function(res) {
                const result = res.text;
                assert.include(result, `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.sitemapindex["sitemap"][0]["loc"] == "").to.eq(false); // To ensure the loc of a section name in the sitemap is not empty
                expect(data.sitemapindex["sitemap"][1]["loc"] == "").to.eq(false); // To ensure the loc of a section name in the sitemap is not empty
            })
            .end(done);
    });

    it('want to get section sitemap for NTL', function(done) {
        request(app)
            .get('/v1/now/celebrity')
            .expect(function(res) {
                const result = res.text;
                const data = JSON.parse(parser.toJson(res.text));
                expect(data.urlset["url"][0]["loc"] == "").to.eq(false); // To ensure the loc of an item in the sitemap is not empty
                expect(data.urlset["url"][1]["lastmod"] >= data.urlset["url"][2]["lastmod"]).to.eq(true); // To ensure they are sorted by the latest modify date/time
            })
            .end(done);
    });


});