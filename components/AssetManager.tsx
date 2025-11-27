import React, { useState, useEffect } from 'react';
import { Asset, AppMode } from '../types';
import { loadAssets, saveAsset } from '../services/storage';

interface AssetManagerProps {
  mode: AppMode;
}

const AssetManager: React.FC<AssetManagerProps> = ({ mode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '',
    type: 'STOCK',
    value: 0,
    cost: 0,
    currency: 'USD'
  });

  const refreshList = () => {
    loadAssets(mode).then(setAssets);
  };

  useEffect(() => {
    refreshList();
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.value) return;

    const newAsset: Asset = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as any,
      value: Number(formData.value),
      cost: Number(formData.cost) || Number(formData.value),
      currency: formData.currency || 'USD'
    };

    await saveAsset(newAsset, mode);
    setFormData({ name: '', type: 'STOCK', value: 0, cost: 0, currency: 'USD' });
    refreshList();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">記帳功能 (資產管理)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-700">新增資產項目</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">資產名稱</label>
              <input
                type="text"
                required
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="例如: 台積電, 美金定存"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">類型</label>
                <select
                  className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="STOCK">股票</option>
                  <option value="CASH">現金</option>
                  <option value="CRYPTO">加密貨幣</option>
                  <option value="REAL_ESTATE">房地產</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">貨幣</label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50"
                  value="USD"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">目前市值</label>
                <input
                  type="number"
                  required
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                  value={formData.value || ''}
                  onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">原始成本</label>
                <input
                  type="number"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                  value={formData.cost || ''}
                  onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-slate-700 transition">
              新增資產
            </button>
          </form>
        </div>

        {/* List Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-700">最近新增</h3>
          <div className="space-y-3">
            {assets.slice(0, 5).map(asset => (
              <div key={asset.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-800">{asset.name}</p>
                  <p className="text-xs text-slate-500">{asset.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">${asset.value.toLocaleString()}</p>
                  <p className={`text-xs ${asset.value >= asset.cost ? 'text-green-500' : 'text-red-500'}`}>
                    {((asset.value - asset.cost) / asset.cost * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
            {assets.length === 0 && <p className="text-slate-400 text-center py-8">目前無資產紀錄</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManager;