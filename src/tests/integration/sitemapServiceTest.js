import moment from 'moment';
import xml2js from 'xml2js';
import { sitemapType, cmsStatus, news } from '../../app/constants';
import Sitemap from '../../app/models/sitemap';
import sitemapController from '../../app/controllers/sitemapController';
import { SitemapBaseMock, SitemapSectionMock } from './sitemapMock';
import app from '../../app/server';

//HACK: supertest doesn't support ES6 yet
var request = require('supertest');

describe('Sitemap service integration test', () => {
    const parseString = xml2js.parseString;
    const server = app().server;
    const siteId = 'test';
    const urlGetRoot = `/v1/${siteId}/`;

    const mockIndexes = [
        new SitemapBaseMock('TEST-1001', 'fashion', '0', 'weekly', '0.9', '1111'),
        new SitemapBaseMock('TEST-2001', 'news', '1', 'daily', '1.0', '2222')
    ];

    const mockSections = [
        //For fashion, OK
        new SitemapSectionMock('TEST-1002', 'fashion/test-1', '0', null, null, null, ['TEST-1111'], moment().toISOString(), 'http://image.com/test-1', null, 'test-1', null, null),
        //For fashion, OK
        new SitemapSectionMock('TEST-1003', 'fashion/test-2', '0', 'daily', '1.0', null, ['TEST-1111'], moment().subtract(100, 'days').toISOString(), 'http://image.com/test-2', 'test-2 caption', 'test-2', null, null),
        //Does not belong to any indexes
        new SitemapSectionMock('TEST-1004', 'celebrity/test-3', '0', 'daily', '1.0', null, ['TEST-9999'], moment().toISOString(), null, null, null, null, null),
        //For news, OK
        new SitemapSectionMock('TEST-2002', 'news/test-1', '1', null, null, null, ['TEST-2222'], moment().toISOString(), null, null, 'test1 newstitle', 'test1 name', 'test1 keywords'),
        //For news, older than past 4 days limit
        new SitemapSectionMock('TEST-2003', 'news/test-2', '1', null, null, null, ['TEST-2222'], moment().subtract(100, 'days').toISOString(), null, null, 'test2 newstitle', 'test2 name', 'test2 keywords'),
        //For news, OK
        new SitemapSectionMock('TEST-2004', 'news/test-3', '1', 'monthly', '0.5', null, ['TEST-2222'], moment().subtract(3, 'days').toISOString(), null, null, 'test3 newstitle', 'test2 name', null)
    ];

    describe('Before', () => {
        mockIndexes.forEach(index => {
            it('create index nodes', done => {
                sitemapController.processMessage(cmsStatus.published, siteId, index.getContent())
                    .then(() => done()).catch(error => done(error));
            });
        });
        mockSections.forEach(section => {
            it('create sections nodes', done => {
                sitemapController.processMessage(cmsStatus.published, siteId, section.getContent())
                    .then(() => done()).catch(error => done(error));
            });
        });
    });

    describe('Get sitemap', () => {
        it('should get index sitemap', done => {
            request(server)
                .get(urlGetRoot)
                .expect(200)
                .expect('Content-Type', /xml/)
                .end((err, res) => {
                    if(err) return done(err);
                    parseString(res.text, (error, result) => {
                        expect(result.sitemapindex.sitemap).to.have.lengthOf(mockIndexes.length);
                        expect(result.sitemapindex.$.xmlns).to.contain('http://www.sitemaps.org/schemas/sitemap');
                        const locs = [ ...mockIndexes.map(m => m.content.siteUrl + m.content.url) ];
                        result.sitemapindex.sitemap.forEach(i => {
                            expect(locs).to.include(i.loc[0]);
                        });
                        done();
                    });
                });
        });

        it('should get section sitemap', done => {
            request(server)
                .get(urlGetRoot + 'fashion')
                .expect(200)
                .expect('Content-Type', /xml/)
                .end((err, res) => {
                    if(err) return done(err);
                    parseString(res.text, (error, result) => {
                        expect(result.urlset.url).to.have.lengthOf(2);
                        result.urlset.url.forEach(i => {
                            expect(i.loc[0]).to.contain('fashion');
                            expect(i["image:image"][0]["image:loc"][0]).to.contain('image.com');
                        });
                        done();
                    });
                });
        });

        it('should get news sitemap', done => {
            request(server)
                .get(urlGetRoot + 'news')
                .expect(200)
                .expect('Content-Type', /xml/)
                .end((err, res) => {
                    if(err) return done(err);
                    parseString(res.text, (error, result) => {
                        expect(result.urlset.url).to.have.lengthOf(2);
                        result.urlset.url.forEach(i => {
                            expect(i.loc[0]).to.contain('news');
                            expect(i["news:news"][0]["news:title"][0]).to.contain('newstitle');
                        });
                        done();
                    });
                });
        });
    });

    describe('After', () => {
        mockIndexes.forEach(index => {
            it('clean up index nodes', done => {
                Sitemap.destroy({ where: { id: index.id }})
                    .then(() => done()).catch(error => done(error));
            });
        });
        mockSections.forEach(section => {
            it('clean up section nodes', done => {
                Sitemap.destroy({ where: { id: section.id }})
                    .then(() => done()).catch(error => done(error));
            });
        });
    });
});
