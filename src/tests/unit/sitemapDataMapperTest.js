import sitemapDataMapper from '../../app/helpers/sitemapDataMapper';

describe('sitemapDataMapper test', () => {
    const siteId = 'test';

    describe('getSitemap test', () => {
        it('should get a sitemap object if node types are not in exclusion list', () => {
            const source = {
                id: 'TEST-1234',
                nodeTypeAliasPath: ['Page', 'Editorial', 'Article']
            };
            const result = sitemapDataMapper.getSitemapToSave(siteId, source);
            expect(result).not.to.be.null;
            expect(result.id).to.be.equal(source.id);
            expect(result.siteId).to.be.equal(siteId);
        });

        [...sitemapDataMapper.nodeTypesToBeExcluded].forEach(nodeType => {
            it(`should not get a sitemap object if node types(${nodeType}) are in exclusion list`, () => {
                const source = {
                    id: 'TEST-1234',
                    nodeTypeAliasPath: ['Page', 'Editorial', `${nodeType}`]
                };
                const result = sitemapDataMapper.getSitemapToSave(siteId, source);
                expect(result).to.be.null;
            });
        });

        it('should not get a sitemap object if root sitemap node', () => {
            const source = {
                id: 'TEST-1234',
                nodeTypeAliasPath: ['Page', 'Editorial', 'Article'],    //all valid
                urlName: 'sitemap'  //It means root sitemap
            };
            const result = sitemapDataMapper.getSitemapToSave(siteId, source);
            expect(result).to.be.null;
        });
    });
});