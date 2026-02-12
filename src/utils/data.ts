import stocksData from './stocks.json';
import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import { rollForEvent } from './historicalEvents';
import type { HistoricalEvent } from './historicalEvents';

// Stock pool based on subscription
const getStockPool = (isPro: boolean) => {
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

// startIndex(200) + maxMoves ต้องพอ → PRO: 200+250=450, Free: 200+100=300
const WINDOW_SIZE_PRO = 450;
const WINDOW_SIZE_FREE = 300;
const MIN_DATA_PRO = 500;   // ต้องมี data อย่างน้อยนี้ถึงจะ slice ได้
const MIN_DATA_FREE = 350;

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
    const response = await CapacitorHttp.get({
      url: stooqUrl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    csvData = response.data;
  } else {
    csvData = await fetchStockCSV(symbol);
  }

  if (!csvData || csvData.length < 100) throw new Error('Bad data format');
  return parseCSV(csvData);
};

/**
 * Try to fetch event mode data for a historical crisis.
 * Uses dynamic window: prefers 450 candles (200 display + 250 PRO moves), min 350.
 */
const tryEventMode = async (event: HistoricalEvent): Promise<StockData | null> => {
  const eventStart = new Date(event.startDate).getTime();
  const eventEnd = new Date(event.endDate).getTime();
  const preferredWindow = WINDOW_SIZE_PRO; // 450 — enough for PRO (event mode is PRO-only)
  const minWindow = 200;                   // 200 = candles ที่แสดง (startIndex), crisis events สั้นกว่า normal

  // Shuffle event stocks and try each one
  const shuffledStocks = [...event.stocks].sort(() => Math.random() - 0.5);
  // Try max 5 stocks to avoid long load times
  const stocksToTry = shuffledStocks.slice(0, 5);

  console.log(`[Event] Trying event: ${event.name} (${event.startDate} to ${event.endDate}), stocks to try: ${stocksToTry.length}`);

  for (const symbol of stocksToTry) {
    try {
      const allCandles = await fetchCandleData(symbol);

      // Filter candles within event date range
      const eventCandles = allCandles.filter(c => {
        const t = new Date(c.time).getTime();
        return t >= eventStart && t <= eventEnd;
      });

      // Need at least minimum candles for a playable game
      if (eventCandles.length < minWindow) {
        console.log(`[Event] ${symbol} only has ${eventCandles.length} candles in event range (need ${minWindow}+), skipping`);
        continue;
      }

      // Use preferred window or all available candles if less
      const windowSize = Math.min(preferredWindow, eventCandles.length);

      // Pick random window within event range
      const maxStart = eventCandles.length - windowSize;
      const startIdx = maxStart > 0 ? Math.floor(Math.random() * (maxStart + 1)) : 0;

      console.log(`[Event] ✅ ${event.name}: ${symbol}, candles: ${eventCandles.length}, window: ${windowSize}, start: ${startIdx}`);

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
export const fetchRandomStockData = async (isPro: boolean = false): Promise<StockData> => {
  const stocks = getStockPool(isPro);

  // PRO-only: Roll for event mode (1 in 7 chance)
  if (isPro) {
    console.log('[Data] PRO detected, rolling for event...');
    const event = rollForEvent();
    if (event) {
      console.log(`[Data] 🎲 Event rolled! → ${event.name}`);
      const eventData = await tryEventMode(event);
      if (eventData) {
        console.log(`[Data] ✅ Event mode active: ${event.name} with ${eventData.data.length} candles`);
        return eventData;
      }
      console.log('[Data] ❌ Event mode failed, falling back to normal mode');
    } else {
      console.log('[Data] 🎲 No event this round (normal roll)');
    }
  } else {
    console.log('[Data] Free user, skipping event roll');
  }

  // Normal mode: random stock, random window
  // PRO ต้องการ 450 candles (200 แสดง + 250 moves), Free ต้องการ 300 (200 + 100)
  const windowSize = isPro ? WINDOW_SIZE_PRO : WINDOW_SIZE_FREE;
  const minDataRequired = isPro ? MIN_DATA_PRO : MIN_DATA_FREE;
  const stockInfo = stocks[Math.floor(Math.random() * stocks.length)];

  try {
    const allCandles = await fetchCandleData(stockInfo.symbol);

    if (allCandles.length < minDataRequired) throw new Error(`Data too short: ${allCandles.length} < ${minDataRequired}`);

    const maxStartIndex = allCandles.length - windowSize;
    const randomStartIndex = Math.floor(Math.random() * maxStartIndex);

    console.log(`[Data] Stock: ${stockInfo.symbol}, Total candles: ${allCandles.length}, Window: ${windowSize}, Random start: ${randomStartIndex}, Date range: ${allCandles[randomStartIndex].time} to ${allCandles[randomStartIndex + windowSize - 1].time}`);

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
