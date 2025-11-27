// 系統運作模式
export enum AppMode {
  MOCK = 'MOCK', // 樣品屋：使用模擬數據
  REAL = 'REAL'  // 真房子：使用真實 API
}

// 股票 K 線數據
export interface CandleData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  dateStr?: string; // 格式化後的日期字串
}

// 股票即時報價
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

// 資產項目
export interface Asset {
  id: string;
  name: string; // 資產名稱 (e.g., 台積電, 美金定存)
  type: 'STOCK' | 'CASH' | 'CRYPTO' | 'REAL_ESTATE' | 'OTHER';
  value: number; // 當前總市值
  cost: number; // 原始成本
  currency: string;
  quantity?: number; // 數量 (可選)
}

// 交易紀錄
export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
  dateStr: string;
}

// 投資組合摘要
export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  unrealizedPL: number; // 未實現損益
  unrealizedPLPercent: number;
  cashBalance: number;
  assets: Asset[];
}

// 教育內容
export interface EduContent {
  id: string;
  title: string;
  category: 'BEGINNER' | 'TECHNICAL' | 'STRATEGY';
  content: string;
}

// 環境變數介面
export interface EnvConfig {
  finnhubKey: string;
  firebaseConfig: string; // JSON string
  geminiKey: string;
}