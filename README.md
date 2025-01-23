# nepali-news-scraper

A powerful Node.js package to scrape news from popular Nepali news portals including Kathmandu Post and Kantipur (ekantipur.com). This package provides a simple and efficient way to access news articles programmatically.

## Features

✨ **Multiple News Sources**
- Kathmandu Post (kathmandupost.com)
- Kantipur (ekantipur.com)

🚀 **Rich Article Data**
- Title
- Author
- Published Date
- Updated Date (Kathmandu Post only)
- Summary
- Full Content
- Article URL

📊 **Article Statistics**
- Word count
- Character count
- Content analysis

⚡ **Performance Features**
- Configurable article limits
- Automatic rate limiting
- Error handling
- Parallel scraping support

## Installation

```bash
npm install nepali-news-scraper
```

## Quick Start

```javascript
const { scrapeKathmanduPost, scrapeKantipur } = require('nepali-news-scraper');

// Scrape Kathmandu Post
async function getKathmanduPostNews() {
    try {
        const news = await scrapeKathmanduPost(5); // Get 5 articles
        news.forEach(article => {
            console.log('Title:', article.title);
            console.log('Content:', article.content);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Scrape Kantipur
async function getKantipurNews() {
    try {
        const news = await scrapeKantipur(5); // Get 5 articles
        news.forEach(article => {
            console.log('Title:', article.title);
            console.log('Content:', article.content);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

## API Reference

### scrapeKathmanduPost(limit = 10)

Scrapes news articles from Kathmandu Post.

**Parameters:**
- `limit` (optional): Number of articles to scrape (default: 10)

**Returns:**
- Promise<Array<Article>> where Article has the following structure:
```typescript
{
    title: string;           // Article title
    author: string;          // Article author
    publishedDate: string;   // Publication date
    updatedDate?: string;    // Last update date (if available)
    link: string;           // Full URL to the article
    summary: string;        // Article summary/excerpt
    content: string;        // Full article content
}
```

### scrapeKantipur(limit = 10)

Scrapes news articles from Kantipur.

**Parameters:**
- `limit` (optional): Number of articles to scrape (default: 10)

**Returns:**
- Promise<Array<Article>> where Article has the following structure:
```typescript
{
    title: string;           // Article title (in Nepali)
    author: string;          // Article author
    publishedDate: string;   // Publication date (in Nepali)
    link: string;           // Full URL to the article
    summary: string;        // Article summary/excerpt (in Nepali)
    content: string;        // Full article content (in Nepali)
}
```

## Testing Tool

The package includes a testing tool (`test.js`) that allows you to quickly test the scrapers:

```bash
# Show help
node test.js --help

# Basic usage (10 articles from both sources)
node test.js

# Get 5 articles from both sources
node test.js 5

# Get 15 articles from Kathmandu Post only
node test.js 15 kathmandupost

# Get 20 articles from Kantipur only
node test.js 20 kantipur
```

The test tool provides detailed output including:
- Article content
- Word and character counts
- Source statistics
- Success/failure rates

## Error Handling

The package implements robust error handling:

```javascript
try {
    const news = await scrapeKathmanduPost(5);
    // Process news...
} catch (error) {
    if (error.message.includes('network')) {
        console.error('Network error. Please check your connection.');
    } else if (error.message.includes('parsing')) {
        console.error('Error parsing article content.');
    } else {
        console.error('Unexpected error:', error.message);
    }
}
```

## Rate Limiting

To be respectful to the news websites:
- 1-second delay between article detail requests
- Automatic retry with exponential backoff
- Maximum concurrent request limiting

## Best Practices

1. **Respect Rate Limits**
   - Don't make too many requests in a short time
   - Use reasonable article limits

2. **Error Handling**
   - Always wrap scraping calls in try-catch blocks
   - Implement proper error handling

3. **Data Processing**
   - Validate scraped data before using
   - Handle missing or null values gracefully

4. **Content Storage**
   - Store content with proper character encoding
   - Preserve original formatting when possible

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Support

If you encounter any issues or have questions, please:
1. Check the [issues page](https://github.com/yourusername/nepali-news-scraper/issues)
2. Create a new issue if needed
3. Provide detailed information about the problem

## Changelog

### 1.0.0
- Initial release
- Support for Kathmandu Post and Kantipur
- Basic scraping functionality
- Testing tool included
