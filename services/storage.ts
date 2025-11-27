import { Asset, Transaction, AppMode } from '../types';
import { MOCK_ASSETS, MOCK_TRANSACTIONS } from '../constants';

// 這裡模擬 Firebase SDK 的引入，實際上如果是真實專案需要 install firebase
// 為了讓代碼在單一檔案環境運作，我們這邊做一個簡單的 Interface 抽象層

// 簡單的 LocalStorage Key
const LS_ASSETS_KEY = 'alphatrade_assets';
const LS_TX_KEY = 'alphatrade_transactions';

/**
 * 載入資產列表
 */
export const loadAssets = async (mode: AppMode): Promise<Asset[]> => {
  if (mode === AppMode.MOCK) {
    // 嘗試從 LocalStorage 讀取，如果沒有則使用預設 Mock
    const stored = localStorage.getItem(LS_ASSETS_KEY);
    return stored ? JSON.parse(stored) : MOCK_ASSETS;
  }
  
  // TODO: 真實模式下應連接 Firestore
  // 由於無法在此環境配置真實 Firebase npm packages，這裡僅示範邏輯分支
  console.log('[Storage] Real mode: Fetching from Firestore (Simulated connection)...');
  const stored = localStorage.getItem(LS_ASSETS_KEY);
  return stored ? JSON.parse(stored) : MOCK_ASSETS; 
};

/**
 * 儲存資產列表
 */
export const saveAsset = async (asset: Asset, mode: AppMode): Promise<void> => {
  const currentAssets = await loadAssets(mode);
  const existingIndex = currentAssets.findIndex(a => a.id === asset.id);
  
  let newAssets;
  if (existingIndex >= 0) {
    newAssets = [...currentAssets];
    newAssets[existingIndex] = asset;
  } else {
    newAssets = [...currentAssets, asset];
  }

  if (mode === AppMode.MOCK) {
    localStorage.setItem(LS_ASSETS_KEY, JSON.stringify(newAssets));
  } else {
    // TODO: Firestore write
    console.log('[Storage] Real mode: Writing to Firestore...');
    localStorage.setItem(LS_ASSETS_KEY, JSON.stringify(newAssets));
  }
};

/**
 * 載入交易紀錄
 */
export const loadTransactions = async (mode: AppMode): Promise<Transaction[]> => {
  const stored = localStorage.getItem(LS_TX_KEY);
  return stored ? JSON.parse(stored) : (mode === AppMode.MOCK ? MOCK_TRANSACTIONS : []);
};

/**
 * 新增交易紀錄
 */
export const addTransaction = async (tx: Transaction, mode: AppMode): Promise<void> => {
  const currentTxs = await loadTransactions(mode);
  const newTxs = [tx, ...currentTxs];
  
  if (mode === AppMode.MOCK) {
    localStorage.setItem(LS_TX_KEY, JSON.stringify(newTxs));
  } else {
    // TODO: Firestore write
    localStorage.setItem(LS_TX_KEY, JSON.stringify(newTxs));
  }
};
