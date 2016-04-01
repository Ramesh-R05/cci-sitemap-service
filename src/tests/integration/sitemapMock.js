export class SitemapBaseMock {
    constructor(id, urlName, isNews, frequency, priority, rootNodeId) {
        this.content = {
            id: id,
            nodeTypeAliasPath: [],
            nodeTypeAlias: 'GoogleSitemap',
            siteUrl: 'http://test.com/',
            url: 'sitemap/' + urlName,
            urlName: urlName,
            isNewsSitemap: isNews,
            sitemapFrequency: frequency,
            sitemapPriority: priority,
            sitemapRootNodeIds: rootNodeId
        };
    }
    getContent() {
        return this.content;
    }
}

export class SitemapSectionMock extends SitemapBaseMock {
    constructor(id, urlName, isNews, frequency, priority, rootNodeId, path, pageDateCreated, contentImageUrl, contentImageCaption, contentTitle, siteTitle, contentNewsKeywords) {
        super(id, urlName, isNews, frequency, priority, rootNodeId);
        this.extraContent = {
            path: path,
            pageDateCreated: pageDateCreated,
            contentImageUrl: contentImageUrl,
            contentImageCaption: contentImageCaption,
            contentTitle: contentTitle,
            siteTitle: siteTitle,
            contentNewsKeywords: contentNewsKeywords,
            nodeTypeAlias: 'Article',
            url: urlName,
            sitemapFrequency: frequency,
            sitemapPriority: priority,
            sitemapRootNodeIds: ''
        };
    }
    getContent() {
        let baseContent = super.getContent();
        let otherContent = this.extraContent;
        return Object.assign({}, baseContent, otherContent);
    }
}