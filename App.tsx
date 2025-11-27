import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TradingView from './components/TradingView';
import TradePanel from './components/TradePanel';
import AssetManager from './components/AssetManager';
import Education from './components/Education';
import { AppMode } from './types';

function App() {
  const [currentTab, setTab] = useState('dashboard');
  const [mode, setMode] = useState<AppMode>(AppMode.MOCK);

  // 環境變數檢查與自動切換
  useEffect(() => {
    // Cast import.meta to any to fix Property 'env' does not exist on type 'ImportMeta'
    const finnhubKey = (import.meta as any).env?.VITE_FINNHUB_API_KEY;
    const geminiKey = process.env.API_KEY; // Using standard process.env as per Gemini instruction

    // 如果有任一關鍵金鑰，則預設為真實模式，否則維持 Mock
    if (finnhubKey && geminiKey) {
      console.log('Detected API Keys, switching to REAL mode capability.');
      setMode(AppMode.REAL);
    } else {
      console.log('Missing API Keys, defaulting to MOCK mode.');
    }
  }, []);

  const toggleMode = () => {
    setMode(prev => prev === AppMode.REAL ? AppMode.MOCK : AppMode.REAL);
  };

  const renderContent = () => {
    // Cast import.meta to any to fix Property 'env' does not exist on type 'ImportMeta'
    const finnhubKey = (import.meta as any).env?.VITE_FINNHUB_API_KEY || '';
    
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard mode={mode} />;
      case 'tradingview':
        return <TradingView mode={mode} apiKey={finnhubKey} />;
      case 'trade':
        return <TradePanel mode={mode} apiKey={finnhubKey} />;
      case 'accounting':
        return <AssetManager mode={mode} />;
      case 'education':
        return <Education />;
      default:
        return <Dashboard mode={mode} />;
    }
  };

  return (
    <Layout 
      currentTab={currentTab} 
      setTab={setTab} 
      mode={mode}
      toggleMode={toggleMode}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;