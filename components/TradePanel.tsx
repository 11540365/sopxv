import React, { useState, useEffect } from 'react';
import { AppMode, Transaction, StockQuote } from '../types';
import { fetchQuote } from '../services/market';
import { addTransaction, loadTransactions } from '../services/storage';

interface TradePanelProps {
  mode: AppMode;
  apiKey?: string;
}

const TradePanel: React.FC<TradePanelProps> = ({ mode, apiKey }) => {
  const [symbol, setSymbol] = useState('AAPL');
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions(mode).then(setTransactions);
  }, [mode]);

  const handleQuote = async () => {
    setLoading(true);
    const data = await fetchQuote(symbol, mode, apiKey);
    setQuote(data);
    setLoading(false);
  };

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!quote) return;
    
    const total = quote.price * quantity;
    const confirmMsg = `確認${type === 'BUY' ? '買入' : '賣出'} ${quantity} 股 ${symbol}，總金額 $${total.toFixed(2)}？`;
    
    if (window.confirm(confirmMsg)) {
      const tx: Transaction = {
        id: Date.now().toString(),
        symbol: symbol,
        type: type,
        price: quote.price,
        quantity: quantity,
        total: total,
        timestamp: Date.now(),
        dateStr: new Date().toLocaleString()
      };
      
      await addTransaction(tx, mode);
      const updatedTxs = await loadTransactions(mode);
      setTransactions(updatedTxs);
      alert('交易成功！');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">模擬交易系統</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 border-b pb-2">下單交易</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">股票代號</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="flex-1 border border-slate-300 rounded-lg p-2 font-mono uppercase"
                />
                <button 
                  onClick={handleQuote}
                  disabled={loading}
                  className="bg-secondary text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-600"
                >
                  {loading ? '...' : '詢價'}
                </button>
              </div>
            </div>

            {quote && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                <p className="text-sm text-slate-500">當前價格</p>
                <p className="text-2xl font-bold text-primary">${quote.price}</p>
                <p className={`text-sm ${quote.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {quote.change >= 0 ? '▲' : '▼'} {quote.change} ({quote.changePercent}%)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">股數</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div className="pt-4 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleTrade('BUY')}
                disabled={!quote}
                className="bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50"
              >
                買入
              </button>
              <button 
                onClick={() => handleTrade('SELL')}
                disabled={!quote}
                className="bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
              >
                賣出
              </button>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-700">歷史交易紀錄</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">時間</th>
                  <th className="p-3">代號</th>
                  <th className="p-3">買/賣</th>
                  <th className="p-3 text-right">價格</th>
                  <th className="p-3 text-right">股數</th>
                  <th className="p-3 text-right">總金額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">{tx.dateStr}</td>
                    <td className="p-3 font-bold">{tx.symbol}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        tx.type === 'BUY' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.type === 'BUY' ? '買入' : '賣出'}
                      </span>
                    </td>
                    <td className="p-3 text-right">${tx.price}</td>
                    <td className="p-3 text-right">{tx.quantity}</td>
                    <td className="p-3 text-right font-medium">${tx.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="p-8 text-center text-slate-400">尚無交易紀錄</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;