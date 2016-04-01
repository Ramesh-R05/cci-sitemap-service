import moment from 'moment';
import { sitemapType } from '../constants';

const xmlHeader = "<?xml version='1.0' encoding='UTF-8' ?>";

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
        + `<image:title>${data.contentTitle}</image:title>`
        + `<image:caption>${data.contentImageCaption ? data.contentImageCaption : ''}</image:caption>`
        + `</image:image>`;
    return xml;
}

function getNewsNode(data) {
    if (!data.contentTitle) {
        return '';
    }

    let xml = `<news:news>`
        + `<news:title>${data.contentTitle}</news:title>`
        + `<news:name>${data.siteTitle}</news:name>`
        + `<news:keywords>${data.contentNewsKeywords ? data.contentNewsKeywords : ''}</news:keywords>`
        + `</news:news>`;
    return xml;
}

function generateSectionSitemap(sections, baseNode) {
    let xml = xmlHeader
        + ` <urlset xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`
        + ` xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"`
        + ` xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"`
        + ` xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`;
    const baseFrequency = baseNode.data.sitemapFrequency ? baseNode.data.sitemapFrequency : '';
    const basePriority = baseNode.data.sitemapPriority ? baseNode.data.sitemapPriority : '';
    sections.forEach(section => {
        const data = section.data;
        xml += `<url>`
            + `<loc>${data.siteUrl + data.url}</loc>`
            + `<changefreq>${data.sitemapFrequency ? data.sitemapFrequency : baseFrequency}</changefreq>`
            + `<priority>${data.sitemapPriority ? data.sitemapPriority : basePriority}</priority>`
            + `<lastmod>${moment(data.pageDateCreated).format('Y-MM-DD')}</lastmod>`
            + (baseNode.data.isNewsSitemap ? getNewsNode(data) : getImageNode(data))
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
