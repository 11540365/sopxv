import { CandleData, StockQuote, AppMode } from '../types';
import { MOCK_CANDLES, MOCK_QUOTE } from '../constants';

/**
 * 取得 K 線圖數據
 * @param symbol 股票代號
 * @param resolution 時間區間 (D, W, M)
 * @param mode 當前模式
 * @param apiKey API Key
 */
export const fetchCandles = async (
  symbol: string, 
  resolution: string, 
  mode: AppMode, 
  apiKey?: string
): Promise<CandleData[]> => {
  // --- 模擬模式攔截 ---
  if (mode === AppMode.MOCK || !apiKey) {
    console.log(`[Market Service] Using MOCK candles for ${symbol}`);
    // 簡單模擬不同股票的微小差異
    const multiplier = symbol === 'AAPL' ? 1 : (Math.random() * 0.5 + 0.8);
    return MOCK_CANDLES.map(c => ({
      ...c,
      open: c.open * multiplier,
      high: c.high * multiplier,
      low: c.low * multiplier,
      close: c.close * multiplier,
    }));
  }

  // --- 真實模式 (Finnhub) ---
  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - (resolution === 'D' ? 7776000 : 31536000); // 90天或1年
    const resStr = resolution === '1D' ? 'D' : resolution === '1W' ? 'W' : 'D';

    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resStr}&from=${from}&to=${to}&token=${apiKey}`
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();

    if (data.s === 'ok') {
      return data.t.map((timestamp: number, index: number) => ({
        time: timestamp,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index],
        dateStr: new Date(timestamp * 1000).toISOString().split('T')[0]
      }));
    } else {
      console.warn('[Market Service] Finnhub returned no data, falling back to mock');
      return MOCK_CANDLES;
    }
  } catch (error) {
    console.error('[Market Service] Error fetching candles:', error);
    return MOCK_CANDLES; // Fallback to avoid crash
  }
};

/**
 * 取得即時報價
 */
export const fetchQuote = async (
  symbol: string, 
  mode: AppMode, 
  apiKey?: string
): Promise<StockQuote> => {
  if (mode === AppMode.MOCK || !apiKey) {
    console.log(`[Market Service] Using MOCK quote for ${symbol}`);
    return { ...MOCK_QUOTE, symbol };
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    // Finnhub format: c: Current, d: Change, dp: Percent, h: High, l: Low, o: Open, pc: Previous Close
    return {
      symbol: symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      prevClose: data.pc
    };
  } catch (error) {
    console.error('[Market Service] Error fetching quote:', error);
    return { ...MOCK_QUOTE, symbol };
  }
};