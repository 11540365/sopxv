import { CandleData, StockQuote, Asset, Transaction, EduContent } from './types';

// MOCK DATA: 預設的 K 線數據 (Apple Inc. 模擬)
export const MOCK_CANDLES: CandleData[] = Array.from({ length: 30 }, (_, i) => {
  const basePrice = 150;
  const volatility = 5;
  const open = basePrice + Math.random() * volatility - volatility / 2;
  const close = open + Math.random() * volatility - volatility / 2;
  const high = Math.max(open, close) + Math.random() * 2;
  const low = Math.min(open, close) - Math.random() * 2;
  
  const date = new Date();
  date.setDate(date.getDate() - (30 - i));

  return {
    time: date.getTime() / 1000,
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
    volume: Math.floor(Math.random() * 1000000) + 500000,
    dateStr: date.toISOString().split('T')[0]
  };
});

// MOCK DATA: 即時報價
export const MOCK_QUOTE: StockQuote = {
  symbol: 'AAPL',
  price: 154.32,
  change: 1.25,
  changePercent: 0.82,
  high: 155.00,
  low: 153.10,
  open: 153.50,
  prevClose: 153.07
};

// MOCK DATA: 初始資產
export const MOCK_ASSETS: Asset[] = [
  { id: '1', name: '現金 (USD)', type: 'CASH', value: 50000, cost: 50000, currency: 'USD' },
  { id: '2', name: 'AAPL 股票', type: 'STOCK', value: 15432, cost: 14000, currency: 'USD', quantity: 100 },
  { id: '3', name: '比特幣', type: 'CRYPTO', value: 8500, cost: 5000, currency: 'USD', quantity: 0.2 },
];

// MOCK DATA: 交易紀錄
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', symbol: 'AAPL', type: 'BUY', price: 140.00, quantity: 100, total: 14000, timestamp: Date.now() - 86400000 * 10, dateStr: new Date(Date.now() - 86400000 * 10).toLocaleDateString() },
];

// 教育內容
export const EDU_CONTENTS: EduContent[] = [
  {
    id: 'e1',
    title: '如何看懂 K 線圖 (Candlestick)',
    category: 'BEGINNER',
    content: 'K 線由「實體」和「影線」組成。實體代表開盤價與收盤價的範圍，紅色通常代表下跌（收盤 < 開盤），綠色代表上漲（收盤 > 開盤）。影線則顯示當天的最高與最低價。'
  },
  {
    id: 'e2',
    title: '什麼是成交量 (Volume)？',
    category: 'TECHNICAL',
    content: '成交量代表在特定時間內交易的股票數量。高成交量通常意味著市場對該價格變動的認同度高。如果價格上漲配合高成交量，趨勢可能持續；反之若量縮價漲，可能是多頭力竭的訊號。'
  },
  {
    id: 'e3',
    title: '定期定額投資策略',
    category: 'STRATEGY',
    content: '無需預測市場高低點，固定時間投入固定金額。優點是能平均成本（Dollar-Cost Averaging），在價格低時買入更多股數，價格高時買入較少，長期下來能有效降低波動風險。'
  }
];

export const MOCK_AI_RESPONSE = `[模擬模式 AI 分析]

針對 AAPL (Apple Inc.) 的分析如下：

1. **基本面**：現金流強勁，服務營收持續增長，iPhone 銷售穩定。
2. **技術面**：目前股價位於季線之上，MACD 呈現黃金交叉，短線動能偏多。
3. **風險**：需注意全球消費電子需求放緩及供應鏈問題。

**投資建議**：
建議採取「分批佈局」策略。若股價回測月線支撐不破，可視為買點。長期持有者可續抱。`;
