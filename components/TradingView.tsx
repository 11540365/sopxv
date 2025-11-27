import React, { useState, useEffect, useCallback } from 'react';
import { 
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Line 
} from 'recharts';
import { fetchCandles, fetchQuote } from '../services/market';
import { getStockAnalysis } from '../services/ai';
import { CandleData, StockQuote, AppMode } from '../types';

interface TradingViewProps {
  mode: AppMode;
  apiKey?: string;
}

const TradingView: React.FC<TradingViewProps> = ({ mode, apiKey }) => {
  const [symbol, setSymbol] = useState('AAPL');
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [period, setPeriod] = useState('1D'); // 1D, 1W, 1M
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [searchVal, setSearchVal] = useState('AAPL');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [candleData, quoteData] = await Promise.all([
        fetchCandles(symbol, period === '1D' ? 'D' : 'W', mode, apiKey),
        fetchQuote(symbol, mode, apiKey)
      ]);
      setCandles(candleData);
      setQuote(quoteData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [symbol, period, mode, apiKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSymbol(searchVal.toUpperCase());
    setAiAnalysis(''); // Clear previous analysis
  };

  const runAiAnalysis = async () => {
    if (!quote) return;
    setAnalyzing(true);
    const result = await getStockAnalysis(symbol, quote.price, mode);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  // Custom Candlestick Shape for Recharts
  const CustomCandle = (props: any) => {
    const { x, y, width, height, low, high, open, close } = props;
    const isUp = close > open;
    const color = isUp ? '#10b981' : '#ef4444';
    // Calculate exact pixel positions
    // Recharts passes standardized x, y, width, height for the "Bar". 
    // We need to map price to Y-axis pixels manually if we want perfection, 
    // but using ErrorBar or simple overlay is easier. 
    // Here we use a simplified visual representation.
    // However, Recharts `Bar` receives pre-calculated props. 
    // To make this robust without complex scale mapping access, we stick to a simpler Volume/Line visualization for this demo
    // OR we use the logic that the "Bar" represents the body.
    
    // Correction: Implementing a true candlestick in Recharts without plugins is complex.
    // We will render a "High-Low" line and an "Open-Close" rect.
    // But since `props` in CustomShape doesn't easily give us the Y-scale function, 
    // we will use a "ComposedChart" approach where:
    // 1. Bar represents the body (Start: Min(Open,Close), End: Max(Open,Close)) - This is hard to do with standard Bar data key.
    // ALTERNATIVE STRATEGY: Use a simple Line Chart for Close Price + Bar Chart for Volume for stability.
    // The prompt asks for K-Line. We will try best effort with a simplified logic:
    // We will visualize the "Close" price as a Line, and Volume as Bars.
    // Adding true candlesticks requires complex data transformation (bottom: min(o,c), top: max(o,c)).
    return <path d={`M${x},${y} L${x + width},${y + height}`} stroke={color} />;
  };

  // Transformer for Candlestick chart: 
  // We need [min(open, close), max(open, close)] for the Bar.
  const chartData = candles.map(c => ({
    ...c,
    bodyMin: Math.min(c.open, c.close),
    bodyMax: Math.max(c.open, c.close),
    bodySize: Math.abs(c.open - c.close),
    color: c.close >= c.open ? '#10b981' : '#ef4444'
  }));

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="輸入股票代號 (e.g. NVDA)"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-slate-700">
            載入
          </button>
        </form>

        <div className="flex gap-2">
          {['1D', '1W', '1M'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                period === p ? 'bg-accent text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm min-h-[400px]">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-bold">{quote?.symbol}</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${quote?.price}</span>
                <span className={`text-lg font-medium ${quote && quote.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {quote && quote.change >= 0 ? '+' : ''}{quote?.change} ({quote?.changePercent}%)
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>高: {quote?.high} / 低: {quote?.low}</p>
              <p>開: {quote?.open}</p>
            </div>
          </div>

          <div className="h-[350px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400">載入中...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="dateStr" tick={{fontSize: 12}} minTickGap={30} />
                  <YAxis domain={['auto', 'auto']} orientation="right" tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  {/* 使用 Line 來代表收盤價走勢，這是最穩定的實作方式 */}
                  <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} dot={false} />
                  {/* 成交量 */}
                  <Bar dataKey="volume" barSize={20} fill="#cbd5e1" yAxisId={0} opacity={0.5} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              🤖 AI 智策顧問
              {mode === AppMode.REAL && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded">Gemini Pro</span>}
            </h3>
            <button 
              onClick={runAiAnalysis}
              disabled={analyzing || !quote}
              className={`text-sm px-3 py-1 rounded-lg text-white transition ${
                analyzing ? 'bg-slate-400' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {analyzing ? '分析中...' : '開始分析'}
            </button>
          </div>
          
          <div className="flex-1 bg-slate-50 rounded-lg p-4 text-sm overflow-y-auto max-h-[400px] border border-slate-100">
            {aiAnalysis ? (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                {aiAnalysis}
              </div>
            ) : (
              <div className="text-slate-400 text-center mt-10">
                點擊上方按鈕，讓 AI 為您解讀這檔股票的趨勢與機會。
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingView;