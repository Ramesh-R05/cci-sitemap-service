
//POC. Model would be identical
function extractDataToSave(source, siteId) {
    return {
        id: source.id,
        siteId: siteId,

        data: {
            nodeTypeAlias: source.nodeTypeAlias,                // sitemap index node will have "GoogleSitemap"
            siteUrl: source.siteUrl,                            // root url
            url: source.url,                                    // sub url. <loc> = siteUrl + url
            urlName: source.urlName,
            sitemapFrequency: source.sitemapFrequency,          // should be used for <changefreq> in sub sitemap
            sitemapPriority: source.sitemapPriority,            // should be used for <priority> in sub sitemap
            sitemapRootNodeId: source.sitemapRootNodeId,        //section id for the index
            path: source.path,                                  //To manipulate sub sitemap, this field needs to be filtered by sitempatRootNodeId
            pageDateCreated: source.pageDateCreated,            //<lastmod> in sub sitemap
            contentImageUrl: source.contentImageUrl,            //<image:loc> in sub sitemap (not news)
            contentTitle: source.contentTitle,                  //<image:title> in sub sitemap
            siteTitle: source.siteTitle,                        //<news:name> in news sitemap
            contentNewsKeywords: source.contentNewsKeywords,    //<news:keywords> in news sitemap
        }
    };
}