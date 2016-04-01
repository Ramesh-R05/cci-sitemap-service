import { sitemapType } from '../constants';

const nodeTypesToBeExcluded = new Set([
    'Homepage',
    'Sections',
    'Modules',
    'Folders',
    'Profiles',
    'Teasers'
]);

//HACK: sitemapRootNodeIds is supposed to be array and {site}-{id} format but not atm
//ex. input: 1234, output: [ 'DOLLY-1234' ]
function fixSitemapRootNodeIds(siteId, sitemapRootNodeIds) {
    if (!sitemapRootNodeIds) {
        return null;
    }

    const roots = Array.isArray(sitemapRootNodeIds) ? sitemapRootNodeIds : [sitemapRootNodeIds];
    const site = siteId.toUpperCase();
    if (roots[0].toString().toUpperCase().includes(site)) {
        return roots;
    }

    return [...roots.map(root => site + '-' + root)];
}

function extractFieldsToSave(siteId, source) {
    return {
        id: source.id,
        siteId: siteId,
        data: {
            nodeTypeAlias: source.nodeTypeAlias,                // sitemap index node will have "GoogleSitemap"
            siteUrl: source.siteUrl,                            // root url
            url: source.url,                                    // sub url. <loc> = siteUrl + url
            urlName: source.urlName,
            isNewsSitemap: source.isNewsSitemap,
            sitemapFrequency: source.sitemapFrequency,          // <changefreq>
            sitemapPriority: source.sitemapPriority,            // <priority>
            sitemapRootNodeIds: fixSitemapRootNodeIds(siteId, source.sitemapRootNodeIds),        // section id for the index
            path: source.path,
            pageDateCreated: source.pageDateCreated,            // <lastmod>
            contentImageUrl: source.contentImageUrl,            // <image:loc>
            contentImageCaption: source.contentImageCaption,    // <image:caption>
            contentTitle: source.contentTitle,                  // <image:title> or <news:title>
            siteTitle: source.siteTitle,                        // <news:name>
            contentNewsKeywords: source.contentNewsKeywords     // <news:keywords>
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

export default {
    nodeTypesToBeExcluded,
    getSitemapToSave
};
