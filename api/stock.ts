import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get stock symbol from query
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Missing symbol parameter' });
  }

  // Stooq API URL
  const stooqUrl = `https://stooq.com/q/d/l/?s=${symbol.toLowerCase()}&i=d`;

  try {
    const response = await fetch(stooqUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Stooq returned ${response.status}`);
    }

    const csvData = await response.text();

    // Verify it's CSV data
    if (!csvData.startsWith('Date')) {
      throw new Error('Invalid response format');
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'text/csv');

    return res.status(200).send(csvData);
  } catch (error) {
    console.error('Stock API error:', error);
    return res.status(500).json({ error: 'Failed to fetch stock data' });
  }
}
