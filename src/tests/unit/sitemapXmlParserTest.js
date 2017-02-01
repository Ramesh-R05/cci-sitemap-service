import xml2js from 'xml2js';
import { sitemapType } from '../../app/constants';
import sitemapXmlParser from '../../app/helpers/sitemapXmlParser';
const parseString = xml2js.parseString;

describe('sitemapXmlParser test', () => {
    describe('generateSitemapXml test', () => {
        const rootUrl = 'http://test.com/';

        function assertXmlHeader(headerObj) {
            expect(headerObj['xmlns']).to.contain('http://www.sitemaps.org/schemas/sitemap/0.9');
            expect(headerObj['xmlns:image']).to.contain('http://www.google.com/schemas/sitemap-image');
            expect(headerObj['xmlns:video']).to.contain('http://www.google.com/schemas/sitemap-video');
            expect(headerObj['xmlns:n']).to.contain('http://www.google.com/schemas/sitemap-news');
            expect(headerObj['xmlns:mobile']).to.contain('http://www.google.com/schemas/sitemap-mobile');
        }

        it('should get index sitemap', () => {
            const urls = ['test1', 'test2', 'test3'];
            const source = [ ...urls.map(url => {
                return { data: { siteUrl: rootUrl, url: url } };
            }) ];

            const xml = sitemapXmlParser.generateSitemapXml(sitemapType.index, source);
            parseString(xml, (err, result) => {
                expect(err).to.be.null;
                expect(result.sitemapindex.sitemap).to.have.lengthOf(urls.length);
                expect(result.sitemapindex.$.xmlns).to.contain('http://www.sitemaps.org/schemas/sitemap');
                urls.forEach((url, index) => {
                    expect(result.sitemapindex.sitemap[index].loc[0]).to.equal(rootUrl + url);
                });
            });
        });

        it('should get section sitemap', () => {
            const baseNode = { data: { sitemapFrequency: 'Daily', sitemapPriority: '1.0', isNewsSitemap: 0 } };
            const sections = [
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test1',
                        pageDateCreated: '2017-01-29T02:41:14.338Z',
                        contentImageUrl: 'http://test.image.com/1111',
                        contentTitle: 'test title1',
                        contentImageCaption: 'test caption1'
                    }
                },
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test2',
                        sitemapFrequency: 'Weekly',
                        sitemapPriority: '0.9',
                        pageDateCreated: '2017-01-29T02:41:14.338Z',
                        contentImageUrl: 'http://test.image.com/2222',
                        contentTitle: 'test title2',
                        contentImageCaption: 'test caption2'
                    }
                },
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test3',
                        pageDateCreated: '2017-01-29T02:41:14.338Z'
                    }
                }
            ];

            const xml = sitemapXmlParser.generateSitemapXml(sitemapType.section, sections, baseNode);
            parseString(xml, (err, result) => {
                const urlNodes = result.urlset.url;
                assertXmlHeader(result.urlset.$);
                expect(result.urlset.url).to.have.lengthOf(sections.length);
                expect(urlNodes[0].loc[0]).to.equal(sections[0].data.siteUrl + sections[0].data.url);
                expect(urlNodes[0].changefreq[0]).to.equal(baseNode.data.sitemapFrequency); //Takes base node's one if doesn't exist
                expect(urlNodes[0].priority[0]).to.equal(baseNode.data.sitemapPriority); //Takes base node's one if doesn't exist
                expect(urlNodes[0]['image:image'][0]['image:loc'][0]).to.equal(sections[0].data.contentImageUrl);
                expect(urlNodes[1].changefreq[0]).to.equal(sections[1].data.sitemapFrequency);
                expect(urlNodes[1].priority[0]).to.equal(sections[1].data.sitemapPriority);
                expect(urlNodes[1].lastmod[0]).to.equal(sections[1].data.pageDateCreated);
                expect(urlNodes[1]['image:image'][0]['image:title'][0]).to.equal(sections[1].data.contentTitle);
                expect(urlNodes[2].lastmod[0]).to.equal(sections[2].data.pageDateCreated);    //No day limit
                expect(urlNodes[2]['image:image']).to.not.exist;
            });

        });

        it('should get news sitemap', () => {
            const baseNode = { data: { sitemapFrequency: 'Daily', sitemapPriority: '1.0', isNewsSitemap: 1 } };
            const news = [
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test1',
                        pageDateCreated: '2017-01-29T02:41:14.338Z',
                        contentTitle: 'test title1',
                        siteTitle: 'test news name1',
                        contentNewsKeywords: 'test news keywords1'
                    }
                },
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test2',
                        sitemapFrequency: 'Weekly',
                        sitemapPriority: '0.9',
                        pageDateCreated:'2017-01-29T02:41:14.338Z',
                        contentTitle: 'test title2',
                        siteTitle: 'test news name2',
                        contentNewsKeywords: 'test news keywords2'
                    }
                }
            ];

            const xml = sitemapXmlParser.generateSitemapXml(sitemapType.section, news, baseNode);
            parseString(xml, (err, result) => {
                const urlNodes = result.urlset.url;
                assertXmlHeader(result.urlset.$);
                expect(result.urlset.url).to.have.lengthOf(news.length);
                expect(urlNodes[0].loc[0]).to.equal(news[0].data.siteUrl + news[0].data.url);
                expect(urlNodes[0].changefreq[0]).to.equal(baseNode.data.sitemapFrequency); //Takes base node's one if doesn't exist
                expect(urlNodes[0].priority[0]).to.equal(baseNode.data.sitemapPriority); //Takes base node's one if doesn't exist
                expect(urlNodes[0]['n:news'][0]['n:title'][0]).to.equal(news[0].data.contentTitle);
                expect(urlNodes[1].changefreq[0]).to.equal(news[1].data.sitemapFrequency);
                expect(urlNodes[1].priority[0]).to.equal(news[1].data.sitemapPriority);
                expect(urlNodes[1].lastmod[0]).to.equal(news[1].data.pageDateCreated);
                expect(urlNodes[1]['n:news'][0]['n:publication'][0]['n:name'][0]).to.equal(news[1].data.siteTitle);
                expect(urlNodes[1]['n:news'][0]['n:publication'][0]['n:language'][0]).to.equal('en');
                expect(urlNodes[1]['n:news'][0]['n:keywords'][0]).to.equal(news[1].data.contentNewsKeywords);
            });
        });

        it('should set priority to default if not specified for news sitemaps', () => {
            const baseNode = { data: { isNewsSitemap: 1 } };
            const news = [
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test1',
                        pageDateCreated: '2017-01-29T02:41:14.338Z',
                        contentTitle: 'test title1',
                        siteTitle: 'test news name1',
                        contentNewsKeywords: 'test news keywords1'
                    }
                }
            ];
            const xml = sitemapXmlParser.generateSitemapXml(sitemapType.section, news, baseNode);
            parseString(xml, (err, result) => {
                expect(result.urlset.url[0].priority[0]).to.equal('1.0');
            });
        });

        it('should set priority as specified for news sitemaps', () => {
            const baseNode = { data: { isNewsSitemap: 1, sitemapPriority: '0.1' } };
            const news = [
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test1',
                        pageDateCreated: '2017-01-29T02:41:14.338Z',
                        contentTitle: 'test title1',
                        siteTitle: 'test news name1',
                        contentNewsKeywords: 'test news keywords1'
                    }
                }
            ];
            const xml = sitemapXmlParser.generateSitemapXml(sitemapType.section, news, baseNode);
            parseString(xml, (err, result) => {
                expect(result.urlset.url[0].priority[0]).to.equal('0.1');
            });
        });

        it('should set priority to default if not specified for non-news sitemaps', () => {
            const baseNode = { data: { isNewsSitemap: 0 } };
            const news = [
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test1',
                        pageDateCreated: '2017-01-29T02:41:14.338Z',
                        contentTitle: 'test title1',
                        siteTitle: 'test news name1',
                        contentNewsKeywords: 'test news keywords1'
                    }
                }
            ];
            const xml = sitemapXmlParser.generateSitemapXml(sitemapType.section, news, baseNode);
            parseString(xml, (err, result) => {
                expect(result.urlset.url[0].priority[0]).to.equal('0.7');
            });
        });

        it('should set priority as specified for non-news sitemaps', () => {
            const baseNode = { data: { isNewsSitemap: 0, sitemapPriority: '0.2' } };
            const news = [
                {
                    data: {
                        siteUrl: rootUrl,
                        url: 'test1',
                        pageDateCreated: '2017-01-29T02:41:14.338Z',
                        contentTitle: 'test title1',
                        siteTitle: 'test news name1',
                        contentNewsKeywords: 'test news keywords1'
                    }
                }
            ];
            const xml = sitemapXmlParser.generateSitemapXml(sitemapType.section, news, baseNode);
            parseString(xml, (err, result) => {
                expect(result.urlset.url[0].priority[0]).to.equal('0.2');
            });
        });
    });
});
