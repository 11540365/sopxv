import React from 'react';
import { EDU_CONTENTS } from '../constants';

const Education: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">投資新手教學</h2>
      <p className="text-slate-500">掌握基礎知識，邁向專業投資之路。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EDU_CONTENTS.map(edu => (
          <div key={edu.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-slate-100 flex flex-col">
            <div className="mb-4">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                edu.category === 'BEGINNER' ? 'bg-green-100 text-green-600' :
                edu.category === 'TECHNICAL' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {edu.category === 'BEGINNER' ? '入門基礎' : edu.category === 'TECHNICAL' ? '技術分析' : '投資策略'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{edu.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed flex-1">
              {edu.content}
            </p>
          </div>
        ))}

        {/* Static Extra Tip */}
        <div className="bg-gradient-to-br from-primary to-slate-800 text-white p-6 rounded-xl shadow-sm flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-bold mb-2">風險提示</h3>
          <p className="text-sm text-slate-300 opacity-90">
            所有投資皆有風險，過去績效不代表未來表現。
            請在交易前詳閱相關公開說明書，並審慎評估自身風險承受能力。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Education;