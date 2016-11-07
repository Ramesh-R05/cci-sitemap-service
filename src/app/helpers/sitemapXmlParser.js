import moment from 'moment';
import { sitemapType } from '../constants';

const xmlHeader = "<?xml version='1.0' encoding='UTF-8' ?>";
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

function generateIndexSitemap(indexes) {
    let xml = xmlHeader + `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    indexes.forEach(index => {
        const data = index.data;
        xml += `<sitemap><loc>${data.siteUrl + data.url}</loc></sitemap>`;
    });
    xml += '</sitemapindex>';
    return xml;
}

function getImageNode(data) {
    if (!data.contentImageUrl) {
        return '';
    }

    let xml = `<image:image>`
        + `<image:loc>${data.contentImageUrl}</image:loc>`
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
        + `<n:publication_date>${moment(data.pageDateCreated).format('YYYY-MM-DDThh:mmTZD')}</n:publication_date>`
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
    let basePriority = baseNode.data.isNewsSitemap ? '1.0' : '0.7';
    let baseNodeData = baseNode.data;
    if (baseNodeData) {
        if (baseNodeData.sitemapFrequency) baseFrequency = baseNodeData.sitemapFrequency;
        if (baseNodeData.sitemapPriority) basePriority = baseNodeData.sitemapPriority;
    }

    sections.forEach(section => {
        const data = section.data;
        xml += `<url>`
            + `<loc>${data.siteUrl + data.url}</loc>`
            + `<changefreq>${data.sitemapFrequency ? data.sitemapFrequency : baseFrequency}</changefreq>`
            + `<priority>${data.sitemapPriority ? data.sitemapPriority : basePriority}</priority>`
            + `<lastmod>${moment(data.pageDateCreated).format('Y-MM-DD')}</lastmod>`
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
