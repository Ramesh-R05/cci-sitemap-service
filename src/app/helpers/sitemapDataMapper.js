import { sitemapType } from '../constants';

const nodeTypesToBeExcluded = new Set([
    'Homepage',
    'Sections',
    'Modules',
    'Folders',
    'Profiles',
    'Teasers'   //Possible to be added in modules
]);

function extractFieldsToSave(siteId, source) {
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
            contentImageCaption: source.contentImageCaption,    // <image:caption>
            contentTitle: source.contentTitle,                  // <image:title> or <news:title>
            siteTitle: source.siteTitle,                        // <news:name>
            contentNewsKeywords: source.contentNewsKeywords,    // <news:keywords>
        }
    };
}

function getSitemapToSave(siteId, sourceData) {
    if (!siteId || !sourceData || !sourceData.id) {
        const err = `All parameters should be provided siteId: ${siteId}, data: ${sourceData}`;
        throw new SyntaxError(err);
    }

    //No need to store root sitemap node
    if (sourceData.urlName === 'sitemap') {
        return null;
    }

    if (sourceData.nodeTypeAliasPath && sourceData.nodeTypeAliasPath.length > 0) {
        let nodeTypes = new Set(sourceData.nodeTypeAliasPath);
        let intersection = new Set([...nodeTypesToBeExcluded].filter(x => nodeTypes.has(x)));
        if (intersection.size > 0) {
            return null;
        }
    }

    return extractFieldsToSave(siteId, sourceData);
}

function getSitemapForXML(type, source) {
    const indexFields = {
        loc: source.siteUrl + source.url
    }

    if (type === sitemapType.index) {
        return fields;
    }

    const baseFields = {
        ...indexFields,
        changefreq: source.sitemapFrequency,
        priority: source.sitemapPriority,
        lastmod: source.pageDateCreated
    };

    if (type === sitemapType.section) {
        return {
            ...baseFields,
            imageLoc: source.contentImageUrl,
            imageTitle: source.contentTitle,
            imageCaption: source.contentImageCaption
        }
    }

    if (type == sitemapType.news) {
        return {
            ...baseFields,
            newsTitle: source.contentTitle,
            newsName: source.siteTitle,
            newsKeywords: source.contentNewsKeywords
        }
    }
}

export default {
    nodeTypesToBeExcluded,
    getSitemapToSave,
    getSitemapForXML
}