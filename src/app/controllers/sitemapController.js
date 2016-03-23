
//NB: TEST ONLY
function post(req, res, next) {}

function save(siteId, fields) {
    //TODO: (only published status)
    // Ignore root sitemap: urlName = "sitemap"
    // Ignore folder, modules, homepage... refer to listing service
}

function destroy(id) {
    //TODO: delete if unpublished, trashed
}

function getIndex(req, res, next) {
    //TODO:
    // Where: nodeTypeAlias = "GoogleSitemap" and siteId
    // Select: <loc> = siteUrl + url
}

function getSection(req, res, next) {
    //TODO:
    // Get index info
    //    Where: urlName == req.params.section and siteId
    //    Select: sitemapRootNodeId, sitemapFrequency, sitemapPriority
    // Get contents list by above info
    //    Where: path in sitemapRootNodeId and siteId
    //    Select: siteUrl, url, pageDateCreated, contentImageUrl, contentTitle
    //    Order by pageDateCreated desc
}

function getNews(req, res, next) {
    //TODO:
    // Get index info
    //    Where: urlName == "news" and siteId
    //    Select: sitemapRootNodeId, sitemapFrequency, sitemapPriority
    // Get contents list by above info
    //    Where: path in sitemapRootNodeId and siteId and last 4 days (by CMS field or hard-code?)
    //    Select: siteUrl, url, pageDateCreated, siteTitle, contentTitle, contentNewsKeywords
    //    Order by pageDateCreated desc
}


export default {
    post,
    save,
    destroy,
    getIndex,
    getSection,
    getNews
};
