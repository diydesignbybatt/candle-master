/**
 * Cloudflare Pages Function - Stock Data API
 *
 * This replaces the Vercel serverless function.
 * Cloudflare Pages uses the /functions directory for API routes.
 *
 * Route: /api/stock?symbol=AAPL
 */

interface Env {
  // Add environment variables here if needed
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol');

  // Validate symbol parameter
  if (!symbol) {
    return new Response(
      JSON.stringify({ error: 'Missing symbol parameter' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
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

    // Return CSV with CORS headers
    return new Response(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Stock API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stock data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Handle CORS preflight requests
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
};
