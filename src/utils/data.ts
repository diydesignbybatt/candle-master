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
 * CORS proxy list for web - try multiple if one fails
 */
const CORS_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
];

/**
 * Try fetching with multiple CORS proxies
 */
const fetchWithCorsProxy = async (url: string): Promise<string> => {
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxyUrl = CORS_PROXIES[i](url);
      console.log(`[Data] Trying proxy ${i + 1}/${CORS_PROXIES.length}: ${proxyUrl.substring(0, 50)}...`);

      const response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        console.warn(`[Data] Proxy ${i + 1} returned status ${response.status}`);
        continue;
      }

      const text = await response.text();

      // Verify it's CSV data (starts with "Date" header), not an error page
      if (text.startsWith('Date,') || text.startsWith('"Date"')) {
        console.log(`[Data] Proxy ${i + 1} succeeded!`);
        return text;
      }

      // Check if it's a JSON error response
      if (text.startsWith('{') || text.startsWith('<')) {
        console.warn(`[Data] Proxy ${i + 1} returned non-CSV data`);
        continue;
      }

      console.warn(`[Data] Proxy ${i + 1} returned unexpected format`);
    } catch (error) {
      console.warn(`[Data] Proxy ${i + 1} failed:`, error);
    }
  }
  throw new Error('All CORS proxies failed');
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
      // Web: Try multiple CORS proxies
      csvData = await fetchWithCorsProxy(stooqUrl);
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
