const { scrapeKathmanduPost, scrapeKantipur } = require('./index');

function printArticle(article, index) {
    console.log('\n' + '='.repeat(100));
    console.log(`ARTICLE ${index + 1}`);
    console.log('='.repeat(100));
    
    console.log('\nTITLE:', article.title);
    console.log('\nAUTHOR:', article.author || 'Not specified');
    console.log('\nPUBLISHED:', article.publishedDate || 'Not specified');
    if (article.updatedDate) {
        console.log('UPDATED:', article.updatedDate);
    }
    console.log('\nLINK:', article.link);
    
    console.log('\nSUMMARY:');
    console.log('-'.repeat(50));
    console.log(article.summary || 'No summary available');
    
    console.log('\nFULL CONTENT:');
    console.log('-'.repeat(50));
    console.log(article.content || 'No content available');

    // Print word count statistics
    const wordCount = (article.content || '').split(/\s+/).length;
    console.log('\nSTATISTICS:');
    console.log('-'.repeat(50));
    console.log(`Word Count: ${wordCount}`);
    console.log(`Character Count: ${(article.content || '').length}`);
}

function printStats(articles, source) {
    const totalWords = articles.reduce((sum, article) => 
        sum + (article.content || '').split(/\s+/).length, 0);
    const avgWords = Math.round(totalWords / articles.length);
    
    console.log('\n' + '='.repeat(100));
    console.log(`${source} STATISTICS`);
    console.log('='.repeat(100));
    console.log(`Total Articles: ${articles.length}`);
    console.log(`Average Words per Article: ${avgWords}`);
    console.log(`Articles with Author: ${articles.filter(a => a.author).length}`);
    console.log(`Articles with Summary: ${articles.filter(a => a.summary).length}`);
}

async function test() {
    try {
        // Get command line arguments
        const args = process.argv.slice(2);
        const limit = parseInt(args[0]) || 10;
        const source = args[1]?.toLowerCase() || 'both';

        console.log(`\nFetching ${limit} articles...`);
        
        if (source === 'both' || source === 'kathmandupost') {
            console.log('\n KATHMANDU POST NEWS ');
            console.log('='.repeat(100));
            const kpNews = await scrapeKathmanduPost(limit);
            kpNews.forEach(printArticle);
            printStats(kpNews, 'KATHMANDU POST');
        }
        
        if (source === 'both' || source === 'kantipur') {
            console.log('\n\n KANTIPUR NEWS ');
            console.log('='.repeat(100));
            const kantipurNews = await scrapeKantipur(limit);
            kantipurNews.forEach(printArticle);
            printStats(kantipurNews, 'KANTIPUR');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Print usage if --help flag is present
if (process.argv.includes('--help')) {
    console.log(`
Usage: node test.js [number_of_articles] [source]

Arguments:
  number_of_articles  Number of articles to fetch (default: 10)
  source             Source to fetch from: 'kathmandupost', 'kantipur', or 'both' (default: 'both')

Examples:
  node test.js                    # Fetch 10 articles from both sources
  node test.js 5                  # Fetch 5 articles from both sources
  node test.js 15 kathmandupost   # Fetch 15 articles from Kathmandu Post only
  node test.js 20 kantipur        # Fetch 20 articles from Kantipur only
    `);
} else {
    test();
}
