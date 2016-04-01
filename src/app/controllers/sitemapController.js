import moment from 'moment';
import { sitemapType, cmsStatus, news } from '../constants';
import Sitemap from '../models/sitemap';
import dataMapper from '../helpers/sitemapDataMapper';
import xmlParser from '../helpers/sitemapXmlParser';

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

function setXmlResponse(res, xml) {
    res.header('Content-Type', 'text/xml');
    res.send(xml);
}

function getWhereClause(siteId, ...conditions) {
    return {
        $and: [
            { siteId: siteId },
            ...conditions
        ]
    };
}

function getPathQuery(nodeId) {
    return { data: { path: { $ilike: `%${nodeId}%`} } };
}

function getBaseNode(siteId, sectionUrl) {
    return Sitemap.findOne({
        where: getWhereClause(siteId, { data: { urlName: sectionUrl } })
    });
}

function getChildNodes(siteId, baseNode) {
    if (!baseNode
        || !baseNode.data
        || !baseNode.data.sitemapRootNodeIds
        || !Array.isArray(baseNode.data.sitemapRootNodeIds)) {
        return Promise.resolve([]);
    }

    //HACK: Because sequelize $overlap does not work for JSONB columns yet, uses $or with $ilike
    const rootNodeIds = baseNode.data.sitemapRootNodeIds;
    const rootNodeWhere = rootNodeIds.length > 1
        ? { $or: [ ...rootNodeIds.map(id => getPathQuery(id) ) ] }
        : getPathQuery(rootNodeIds[0]);

    let conditions = [];
    //HACK: gets "1" or "0" now. should be fixed!
    baseNode.data.isNewsSitemap = Number(baseNode.data.isNewsSitemap);
    if (baseNode.data.isNewsSitemap) {
        const startDate = moment().subtract(news.daylimit, 'days');
        conditions.push({ data: { pageDateCreated: { $gt: startDate.toDate() } } });
    }
    conditions.push(rootNodeWhere);

    return Sitemap.findAll({
        where: getWhereClause(siteId, ...conditions),
        order: `data->>'pageDateCreated' desc`
    })
    .then(result => {
        return {baseNode: baseNode, childNodes: result};
    });
}

function getIndex(req, res, next) {
    return Sitemap.findAll({
            where: getWhereClause(req.params.site, { data: { nodeTypeAlias: 'GoogleSitemap' } })
        })
        .then(result => {
            const xml = xmlParser.generateSitemapXml(sitemapType.index, result);
            setXmlResponse(res, xml);
        })
        .catch(next);
}

function getSection(req, res, next) {
    const { site, section } = req.params;
    return getBaseNode(site, section)
        .then(baseNode => getChildNodes(site, baseNode))
        .then(result => {
            const xml = xmlParser.generateSitemapXml(sitemapType.section, result.childNodes, result.baseNode);
            setXmlResponse(res, xml);
        })
        .catch(next);
}

export default {
    processMessage,
    getIndex,
    getSection
};
