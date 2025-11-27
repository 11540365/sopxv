import React from 'react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  setTab: (tab: string) => void;
  mode: AppMode;
  toggleMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentTab, setTab, mode, toggleMode }) => {
  const tabs = [
    { id: 'dashboard', label: '資產看板' },
    { id: 'tradingview', label: '專業行情' },
    { id: 'trade', label: '模擬交易' },
    { id: 'accounting', label: '記帳管理' },
    { id: 'education', label: '新手教學' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar (Desktop) / Header (Mobile) */}
      <nav className="bg-primary text-white w-full md:w-64 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-wider">AlphaTrade <span className="text-accent text-sm">Pro</span></h1>
          <div className="mt-4 flex items-center justify-between bg-slate-800 p-2 rounded-lg">
            <span className={`text-xs font-bold ${mode === AppMode.REAL ? 'text-green-400' : 'text-yellow-400'}`}>
              {mode === AppMode.REAL ? '🟢 真實連線' : '🟠 模擬/樣品屋'}
            </span>
            <button 
              onClick={toggleMode}
              className="text-xs bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded transition"
            >
              切換
            </button>
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto flex flex-row md:flex-col p-2 gap-2 md:gap-0">
          {tabs.map(tab => (
            <li key={tab.id} className="flex-1 md:flex-none">
              <button
                onClick={() => setTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentTab === tab.id 
                    ? 'bg-accent text-white font-medium shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
        
        <div className="p-4 text-xs text-slate-500 border-t border-slate-700 hidden md:block">
          &copy; 2024 智策資產管理
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;