const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://kathmandupost.com';

// Helper function to delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeArticleDetail(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const detailContent = $('.page-detail--content');
        return {
            author: detailContent.find('h5.text-capitalize a').text().trim(),
            publishedDate: detailContent.find('.updated-time').first().text().replace('Published at :', '').trim(),
            updatedDate: detailContent.find('.updated-time').eq(1).text().replace('Updated at :', '').trim(),
            content: detailContent.find('.story-section p').map((_, el) => $(el).text().trim()).get().join('\n')
        };
    } catch (error) {
        console.error(`Error scraping article detail: ${url}`, error.message);
        return null;
    }
}

async function scrapeKathmanduPost(limit = 10) {
    try {
        const response = await axios.get(baseUrl);
        const $ = cheerio.load(response.data);

        // Array to store news items
        const newsItems = [];

        // Select all article elements
        $('article.article-image').each((index, element) => {
            if (index < limit) {
                const $element = $(element);
                const title = $element.find('h3 a').text().trim();
                const link = $element.find('h3 a').attr('href');
                const summary = $element.find('p').text().trim();
                const author = $element.find('.article-author').text().replace('By', '').trim();
                
                if (title) {
                    newsItems.push({
                        title,
                        link: link ? `${baseUrl}${link}` : null,
                        summary,
                        author
                    });
                }
            }
        });

        // Get detailed information for all articles with a delay between requests
        for (let i = 0; i < newsItems.length; i++) {
            const articleDetail = await scrapeArticleDetail(newsItems[i].link);
            if (articleDetail) {
                newsItems[i] = { ...newsItems[i], ...articleDetail };
            }
            // Add a 1-second delay between requests to be respectful to the server
            if (i < newsItems.length - 1) {
                await delay(1000);
            }
        }

        return newsItems;
    } catch (error) {
        throw new Error(`Error scraping Kathmandu Post: ${error.message}`);
    }
}

module.exports = scrapeKathmanduPost;
