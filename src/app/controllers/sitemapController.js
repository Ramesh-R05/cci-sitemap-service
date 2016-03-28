import Sitemap from '../models/sitemap';
import { cmsStatus } from '../constants';
import dataMapper from '../helpers/sitemapDataMapper';

//NB: TEST ONLY
function post(req, res, next) {}

function save(siteId, fields) {
    let sitemap = null;
    try {
        sitemap = dataMapper.getSitemapToSave(siteId, fields);
    } catch(e) {
        Promise.reject(e);
    }

    if (!sitemap) {
        return Promise.resolve();   //Ignores if no need to save
    }
    return Sitemap.upsert(sitemap);
}

function destroy(id) {
    return Sitemap.destroy({ where: { id: id }});
}

function processMessage(status, siteId, content) {
    switch (status) {
        case cmsStatus.published:
            return save(siteId, content);
        case cmsStatus.trashed:
        case cmsStatus.unpublished:
            return destroy(content.id);
        case cmsStatus.saved:
            return Promise.resolve();     //Ignores saved status
        default:
            return Promise.reject(new Error('Could not find status in message headers'));
    }
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
    processMessage,
    getIndex,
    getSection,
    getNews
};
