//HACK: supertest doesn't support ES6 yet
var request = require('supertest');
const app = "http://services.sit.bxm.internal/sitemap";
const assert = require('chai').assert;
var schemas  = require("./util/schemas.js")


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
                assert.include(result, schemas.sitemapIndexSchema());
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