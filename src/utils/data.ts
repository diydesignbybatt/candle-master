import stocksData from './stocks.json';
import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import { rollForEvent } from './historicalEvents';
import type { HistoricalEvent } from './historicalEvents';

// Stock pool based on subscription
const getStockPool = () => {
  const isPro = localStorage.getItem('candle_master_subscription') === 'pro';
  return isPro
    ? [...stocksData.free, ...stocksData.pro]
    : stocksData.free;
};

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface EventInfo {
  id: string;
  name: string;
  revealText: string;
}

export interface StockData {
  symbol: string;
  name: string;
  data: Candle[];
  event?: EventInfo;
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
 * Fetch CSV data from Stooq via Cloudflare Workers or CORS proxy
 */
const fetchStockCSV = async (symbol: string): Promise<string> => {
  // Try Cloudflare Workers function first
  try {
    console.log(`[Data] Fetching via Workers: /api/stock?symbol=${symbol}`);
    const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`, {
      signal: AbortSignal.timeout(15000)
    });

    if (response.ok) {
      const text = await response.text();
      if (text.startsWith('Date')) {
        console.log('[Data] Workers function succeeded!');
        return text;
      }
    }
    console.warn('[Data] Workers function failed, trying fallback...');
  } catch (error) {
    console.warn('[Data] Workers function error:', error);
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
 * Parse CSV data into sorted candle array
 */
const parseCSV = (csvData: string): Candle[] => {
  const lines = csvData.trim().split('\n');
  const candles: Candle[] = lines.slice(1).map(line => {
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

  // Sort ascending (oldest first)
  candles.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return candles;
};

/**
 * Fetch raw candle data for a symbol
 */
const fetchCandleData = async (symbol: string): Promise<Candle[]> => {
  const stooqUrl = `https://stooq.com/q/d/l/?s=${symbol.toLowerCase()}&i=d`;
  const isNative = Capacitor.isNativePlatform();

  let csvData: string;

  if (isNative) {
    const response = await CapacitorHttp.get({ url: stooqUrl });
    csvData = response.data;
  } else {
    csvData = await fetchStockCSV(symbol);
  }

  if (!csvData || csvData.length < 100) throw new Error('Bad data format');
  return parseCSV(csvData);
};

/**
 * Try to fetch event mode data for a historical crisis
 */
const tryEventMode = async (event: HistoricalEvent): Promise<StockData | null> => {
  const eventStart = new Date(event.startDate).getTime();
  const eventEnd = new Date(event.endDate).getTime();
  const windowSize = 250;

  // Shuffle event stocks and try each one
  const shuffledStocks = [...event.stocks].sort(() => Math.random() - 0.5);

  for (const symbol of shuffledStocks) {
    try {
      const allCandles = await fetchCandleData(symbol);

      // Filter candles within event date range
      const eventCandles = allCandles.filter(c => {
        const t = new Date(c.time).getTime();
        return t >= eventStart && t <= eventEnd;
      });

      // Need enough candles for a proper game window
      if (eventCandles.length < windowSize) {
        console.log(`[Event] ${symbol} only has ${eventCandles.length} candles in event range, skipping`);
        continue;
      }

      // Pick random window within event range
      const maxStart = eventCandles.length - windowSize;
      const startIdx = Math.floor(Math.random() * (maxStart + 1));

      console.log(`[Event] ${event.name}: ${symbol}, candles in range: ${eventCandles.length}, window start: ${startIdx}`);

      return {
        symbol: symbol.split('.')[0],
        name: stocksData.pro.find(s => s.symbol === symbol)?.name
          || stocksData.free.find(s => s.symbol === symbol)?.name
          || symbol.split('.')[0],
        data: eventCandles.slice(startIdx, startIdx + windowSize),
        event: {
          id: event.id,
          name: event.name,
          revealText: event.revealText,
        },
      };
    } catch (error) {
      console.warn(`[Event] Failed to fetch ${symbol}:`, error);
      continue;
    }
  }

  console.warn(`[Event] All stocks failed for event: ${event.name}`);
  return null;
};

/**
 * Fetches real historical data. PRO users have a 1/7 chance of event mode.
 */
export const fetchRandomStockData = async (): Promise<StockData> => {
  const stocks = getStockPool();
  const isPro = localStorage.getItem('candle_master_subscription') === 'pro';

  // PRO-only: Roll for event mode
  if (isPro) {
    const event = rollForEvent();
    if (event) {
      console.log(`[Data] Event triggered: ${event.name}`);
      const eventData = await tryEventMode(event);
      if (eventData) return eventData;
      console.log('[Data] Event mode failed, falling back to normal mode');
    }
  }

  // Normal mode: random stock, random window
  const stockInfo = stocks[Math.floor(Math.random() * stocks.length)];

  try {
    const allCandles = await fetchCandleData(stockInfo.symbol);

    if (allCandles.length < 300) throw new Error('Data too short');

    const windowSize = 250;
    const maxStartIndex = allCandles.length - windowSize;
    const randomStartIndex = Math.floor(Math.random() * maxStartIndex);

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
