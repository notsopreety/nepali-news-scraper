const axios = require('axios');
const cheerio = require('cheerio');

const baseUrl = 'https://ekantipur.com';

// Helper function to delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeArticleDetail(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Get the article content from desc-content
        const content = $('.desc-content p')
            .filter((_, el) => !$(el).find('script').length)
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(text => text && !text.includes('gaEvent'))
            .join('\n');

        // Get the published date
        const publishedDate = $('.published-at').text().replace('प्रकाशित :', '').trim();

        return {
            content,
            publishedDate
        };
    } catch (error) {
        console.error(`Error scraping article detail: ${url}`, error.message);
        return null;
    }
}

async function scrapeKantipur(limit = 10) {
    try {
        const response = await axios.get(`${baseUrl}/news`);
        const $ = cheerio.load(response.data);

        // Array to store news items
        const newsItems = [];

        // Select all article elements
        $('.normal').each((index, element) => {
            if (index < limit) {
                const $element = $(element);
                const title = $element.find('.teaser h2').text().trim();
                const link = $element.find('.teaser h2 a').attr('href');
                const summary = $element.find('.teaser p').text().trim();
                const author = $element.find('.author a').text().trim();
                
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
        throw new Error(`Error scraping Kantipur: ${error.message}`);
    }
}

module.exports = scrapeKantipur;
