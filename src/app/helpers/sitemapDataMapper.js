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
            nodeTypeAlias: source.nodeTypeAlias,
            siteUrl: source.siteUrl,
            url: source.url,
            urlName: source.urlName,
            isNewsSitemap: source.isNewsSitemap,
            sitemapFrequency: source.sitemapFrequency,
            sitemapPriority: source.sitemapPriority,
            sitemapRootNodeIds: fixSitemapRootNodeIds(siteId, source.sitemapRootNodeIds),
            path: source.path,
            pageDateCreated: source.pageDateCreated,
            contentImageUrl: source.contentImageUrl,
            contentImageCaption: source.contentImageCaption,
            contentTitle: source.contentTitle,
            siteTitle: source.siteTitle,
            contentNewsKeywords: source.contentNewsKeywords
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
