import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 3000;

app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const results = [];
    const items = document.querySelectorAll('[data-component-type="s-search-result"]');

    items.forEach((item) => {
      const title = item.querySelector('h2 a span')?.textContent?.trim();
      const rating = item.querySelector('[aria-label*="stars"]')?.getAttribute('aria-label') || 'No rating';
      const reviews = item.querySelector('[aria-label$="ratings"], [aria-label$="reviews"]')?.textContent?.trim() || '0';
      const image = item.querySelector('img')?.src;

      if (title && image) {
        results.push({ title, rating, reviews, image });
      }
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch or parse data', details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
