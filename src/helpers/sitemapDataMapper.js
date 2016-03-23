
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
            sitemapFrequency: source.sitemapFrequency,          // <changefreq>
            sitemapPriority: source.sitemapPriority,            // <priority>
            sitemapRootNodeId: source.sitemapRootNodeId,        // section id for the index
            path: source.path,
            pageDateCreated: source.pageDateCreated,            // <lastmod>
            contentImageUrl: source.contentImageUrl,            // <image:loc>
            contentTitle: source.contentTitle,                  // <image:title> or <news:title>
            siteTitle: source.siteTitle,                        // <news:name>
            contentNewsKeywords: source.contentNewsKeywords,    // <news:keywords>
        }
    };
}