import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { loadAssets } from '../services/storage';
import { Asset, AppMode } from '../types';

interface DashboardProps {
  mode: AppMode;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ mode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    loadAssets(mode).then(data => {
      setAssets(data);
      setTotalValue(data.reduce((sum, a) => sum + a.value, 0));
    });
  }, [mode]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">資產配置看板</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg">
          <p className="text-blue-200 text-sm font-medium">總資產市值</p>
          <h3 className="text-3xl font-bold mt-2">${totalValue.toLocaleString()}</h3>
          <p className="text-xs text-blue-200 mt-4 opacity-80">更新時間: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">持有資產數量</p>
          <h3 className="text-3xl font-bold mt-2 text-slate-800">{assets.length}</h3>
          <p className="text-xs text-green-500 mt-4 flex items-center">
             資產多樣性健康
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">預估年化報酬 (模擬)</p>
          <h3 className="text-3xl font-bold mt-2 text-slate-800">5.2%</h3>
          <p className="text-xs text-slate-400 mt-4">基於歷史數據回測</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm h-[400px]">
          <h3 className="font-bold text-lg mb-4 text-slate-700">資產分佈 (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assets}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {assets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm overflow-y-auto h-[400px]">
          <h3 className="font-bold text-lg mb-4 text-slate-700">資產明細</h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3 rounded-l-lg">名稱</th>
                <th className="p-3">類型</th>
                <th className="p-3 text-right rounded-r-lg">市值 (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map(asset => (
                <tr key={asset.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-medium text-slate-700">{asset.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                      {asset.type}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-700">${asset.value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;