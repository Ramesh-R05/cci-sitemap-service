import { sitemapType } from '../constants';

const xmlHeader = `<?xml version="1.0" encoding="UTF-8" ?>`;
const specialChars = {
    '&': '&amp;',
    '#': '&#35;',
    '<': '&lt;',
    '>': '&gt;',
    '(': '&#40;',
    ')': '&#41;',
    '"': '&quot;',
    "'": '&apos;'
};

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

function sanitizeSpecialChars(source) {
    if (typeof source !== 'string') {
        return source;
    }

    let target = source;
    Object.keys(specialChars).forEach(key => {
        target = target.replace(new RegExp(escapeRegExp(key), 'g'), specialChars[key]);
    });

    return target;
}

function httpsSet(url) {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('https') || url.includes('foodtolove')) return url;

    return url.replace('http://', 'https://');
}

function generateIndexSitemap(indexes) {
    let xml = xmlHeader + `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    indexes.forEach(index => {
        const data = index.data;
        const dataSiteUrl = httpsSet(data.siteUrl);
        xml += `<sitemap><loc>${dataSiteUrl + data.url}</loc></sitemap>`;
    });
    xml += '</sitemapindex>';
    return xml;
}

function getImageNode(data) {
    let imageUrl = data.contentImageUrl;

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.startsWith('https')) {
        return '';
    }

    imageUrl = imageUrl.replace('http://d3lp4xedbqa8a5.cloudfront.net', 'https://d3lp4xedbqa8a5.cloudfront.net');
    imageUrl = imageUrl.replace('http://cdn.assets.cougar.bauer-media.net.au', 'https://d3lp4xedbqa8a5.cloudfront.net');

    let xml = `<image:image>`
        + `<image:loc><![CDATA[${imageUrl}]]></image:loc>`
        + `<image:title>${sanitizeSpecialChars(data.contentTitle)}</image:title>`
        + `<image:caption>${data.contentImageCaption ? sanitizeSpecialChars(data.contentImageCaption) : ''}</image:caption>`
        + `</image:image>`;
    return xml;
}

function getNewsNode(data) {
    if (!data.contentTitle) {
        return '';
    }

    let xml = `<n:news>`
        + `<n:title>${sanitizeSpecialChars(data.contentTitle)}</n:title>`
        + `<n:publication>`
        + `<n:name>${sanitizeSpecialChars(data.siteTitle)}</n:name>`
        + `<n:language>en</n:language>`
        + `</n:publication>`
        + `<n:keywords>${data.contentNewsKeywords ? sanitizeSpecialChars(data.contentNewsKeywords) : ''}</n:keywords>`
        + `<n:publication_date>${data.pageDateCreated}</n:publication_date>`
        + `</n:news>`;
    return xml;
}

function generateSectionSitemap(sections, baseNode) {
    let xml = xmlHeader
        + ` <urlset`
        + ` xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`
        + ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`
        + ` xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"`
        + ` xmlns:n="http://www.google.com/schemas/sitemap-news/0.9"`
        + ` xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`;

    let baseFrequency = '';
    let baseNodeData = baseNode.data;
    let basePriority = baseNodeData && baseNodeData.isNewsSitemap ? '1.0' : '0.7';

    if (baseNodeData) {
        if (baseNodeData.sitemapFrequency) baseFrequency = baseNodeData.sitemapFrequency;
        if (baseNodeData.sitemapPriority) basePriority = baseNodeData.sitemapPriority;
    }

    if (!sections) {
        return new Error('Section not found');
    }

    sections.forEach(section => {
        const data = section.data;
        const dataSiteUrl = httpsSet(data.siteUrl);

        xml += `<url>`
            + `<loc>${dataSiteUrl + data.url}</loc>`
            + `<changefreq>${data.sitemapFrequency ? data.sitemapFrequency : baseFrequency}</changefreq>`
            + `<priority>${data.sitemapPriority ? data.sitemapPriority : basePriority}</priority>`
            + `<lastmod>${data.pageDateCreated}</lastmod>`
            + (baseNode.data.isNewsSitemap ? getNewsNode(data) : '')
            + getImageNode(data)
            + `<mobile:mobile/>`
            + `</url>`;
    });
    xml += '</urlset>';
    return xml;
}

function generateSitemapXml(type, source, baseNode = {}) {
    switch (type) {
        case sitemapType.index:
            return generateIndexSitemap(source);
        case sitemapType.section:
            return generateSectionSitemap(source, baseNode);
        default:
            return '';
    }
}

export default {
    generateSitemapXml
};
