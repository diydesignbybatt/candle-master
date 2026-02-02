import stocksData from './stocks.json';
import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

// Combine free + pro stocks (for now, all users get access to free stocks only)
// TODO: Filter based on subscription status
const isPro = localStorage.getItem('candle_master_pro') === 'true';
const stocks = isPro
  ? [...stocksData.free, ...stocksData.pro]
  : stocksData.free;

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface StockData {
  symbol: string;
  name: string;
  data: Candle[];
}

/**
 * Fallback generator in case API fails
 */
const generateMockHistory = (info: { symbol: string, name: string }): StockData => {
  const data: Candle[] = [];
  let currentClose = 50 + Math.random() * 100;
  let currentDate = new Date('2010-01-01');
  const endDate = new Date('2023-12-31');

  while (currentDate <= endDate) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const open = currentClose;
      const change = (Math.random() - 0.495) * 0.02 * currentClose;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (0.01 * currentClose);
      const low = Math.min(open, close) - Math.random() * (0.01 * currentClose);

      data.push({
        time: currentDate.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
      });
      currentClose = close;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return { symbol: info.symbol.split('.')[0], name: info.name + " (Simulated)", data };
};

/**
 * Fetch stock data using our own Vercel API route (most reliable)
 * Falls back to direct CORS proxy if API route fails
 */
const fetchStockCSV = async (symbol: string): Promise<string> => {
  // Try our own API route first (Vercel serverless function)
  try {
    console.log(`[Data] Fetching via API route: /api/stock?symbol=${symbol}`);
    const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`, {
      signal: AbortSignal.timeout(15000)
    });

    if (response.ok) {
      const text = await response.text();
      if (text.startsWith('Date')) {
        console.log('[Data] API route succeeded!');
        return text;
      }
    }
    console.warn('[Data] API route failed, trying fallback...');
  } catch (error) {
    console.warn('[Data] API route error:', error);
  }

  // Fallback to CORS proxy
  const stooqUrl = `https://stooq.com/q/d/l/?s=${symbol.toLowerCase()}&i=d`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(stooqUrl)}`;

  console.log('[Data] Trying CORS proxy fallback...');
  const response = await fetch(proxyUrl, {
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) throw new Error('CORS proxy failed');

  const text = await response.text();
  if (!text.startsWith('Date')) throw new Error('Invalid CSV format');

  console.log('[Data] CORS proxy succeeded!');
  return text;
};

/**
 * Fetches real historical data from the elite pool using a reliable proxy
 * Supports both web (CORS proxy) and native app (Capacitor HTTP)
 */
export const fetchRandomStockData = async (): Promise<StockData> => {
  // 1. Pick a random stock from our new 200-item JSON list
  const stockInfo = stocks[Math.floor(Math.random() * stocks.length)];

  // 2. Prepare API parameters
  const stooqUrl = `https://stooq.com/q/d/l/?s=${stockInfo.symbol.toLowerCase()}&i=d`;
  const isNative = Capacitor.isNativePlatform();

  try {
    let csvData: string;

    if (isNative) {
      // Native app: Use Capacitor HTTP (no CORS issues)
      const response = await CapacitorHttp.get({ url: stooqUrl });
      csvData = response.data;
    } else {
      // Web: Use our API route (with CORS proxy fallback)
      csvData = await fetchStockCSV(stockInfo.symbol);
    }

    if (!csvData || csvData.length < 100) throw new Error('Bad data format');

    const lines = csvData.trim().split('\n');
    const allCandles: Candle[] = lines.slice(1).map(line => {
      const columns = line.split(',');
      if (columns.length < 5) return null;
      const [date, open, high, low, close, volume] = columns;
      return {
        time: date,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: volume ? parseInt(volume) : undefined
      } as Candle;
    }).filter((c): c is Candle => c !== null && !isNaN(c.close));

    // Sort by date ascending (oldest first) - Stooq returns descending order
    allCandles.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // Ensure we have enough data to pick a window
    if (allCandles.length < 300) throw new Error('Data too short');

    // 3. Select a random 250-candle training window
    const windowSize = 250;
    const maxStartIndex = allCandles.length - windowSize;
    const randomStartIndex = Math.floor(Math.random() * maxStartIndex);

    // Debug log to verify randomness
    console.log(`[Data] Stock: ${stockInfo.symbol}, Total candles: ${allCandles.length}, Random start: ${randomStartIndex}, Date range: ${allCandles[randomStartIndex].time} to ${allCandles[randomStartIndex + windowSize - 1].time}`);

    return {
      symbol: stockInfo.symbol.split('.')[0],
      name: stockInfo.name,
      data: allCandles.slice(randomStartIndex, randomStartIndex + windowSize)
    };
  } catch (error) {
    console.warn(`Redirecting to simulator for ${stockInfo.symbol}:`, error);
    return generateMockHistory(stockInfo);
  }
};
