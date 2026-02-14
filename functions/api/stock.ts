/**
 * Cloudflare Pages Function - Stock Data API
 *
 * Proxies Stooq API for historical stock data.
 * Route: /api/stock?symbol=AAPL
 *
 * Security: Public endpoint (stock data is public).
 * Input validation prevents SSRF via symbol parameter.
 */

import { getCorsHeaders } from './_shared/cors';
import { isValidSymbol } from './_shared/validation';

interface Env {
  // Add environment variables here if needed
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = getCorsHeaders(context.request);
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol');

  // Validate symbol parameter
  if (!symbol) {
    return new Response(
      JSON.stringify({ error: 'Missing symbol parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  // Validate symbol format (prevents SSRF via URL injection)
  if (!isValidSymbol(symbol)) {
    return new Response(
      JSON.stringify({ error: 'Invalid symbol format' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  // Build Stooq URL safely using URL constructor + encodeURIComponent
  const stooqUrl = new URL('https://stooq.com/q/d/l/');
  stooqUrl.searchParams.set('s', symbol.toLowerCase());
  stooqUrl.searchParams.set('i', 'd');

  try {
    const response = await fetch(stooqUrl.toString(), {
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
        ...corsHeaders,
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Stock API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stock data' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

// Handle CORS preflight requests
export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
};
