
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, UserCategory, SpendingData } from '../types';

interface AnalysisViewProps {
  transactions: Transaction[];
  categories: UserCategory[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ transactions, categories }) => {
  const expenseData = transactions.filter(t => t.type === 'expense');
  
  // 1. Distribution Data (Pie Chart)
  const categoryTotals = expenseData.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData: SpendingData[] = (Object.entries(categoryTotals) as [string, number][]).map(([name, value]) => {
    const categoryInfo = categories.find(c => c.name === name);
    return {
      name,
      value,
      color: categoryInfo?.color || '#CBD5E1'
    };
  }).sort((a, b) => b.value - a.value);

  const totalExpense = pieChartData.reduce((sum: number, item) => sum + item.value, 0);

  // 2. Trend Data (Bar Chart)
  const dailyTotals = expenseData.reduce((acc, t) => {
    const dateKey = new Date(t.date).toISOString().split('T')[0];
    acc[dateKey] = (acc[dateKey] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const trendChartData = Object.entries(dailyTotals)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount,
      rawDate: date
    }))
    .sort((a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime())
    .slice(-7);

  if (pieChartData.length === 0) {
    return (
      <div className="px-6 py-20 text-center flex flex-col items-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-6">
          <PieChartIcon size={40} className="text-indigo-400" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Insight Engine Paused</h3>
        <p className="text-slate-400 text-sm max-w-[200px] font-medium">Record some expenses to see your spending blueprint.</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Overview Tile */}
      <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-600/30 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Monthly Burn</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[65%]" />
            </div>
            <span className="text-[10px] font-bold text-blue-400">Target: $4.5k</span>
          </div>
        </div>
      </div>

      {/* Daily Trend Tile */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-black text-slate-800 mb-8 tracking-tight">Spending Rhythm</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 8 }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                labelStyle={{ fontWeight: 800, color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
              />
              <Bar 
                dataKey="amount" 
                fill="#4f46e5" 
                radius={[8, 8, 8, 8]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Tile */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-black text-slate-800 mb-4 tracking-tight">Category Mix</h3>
        <div className="h-64 w-full relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-[10px] font-black text-slate-400 uppercase">Top Cat</span>
             <span className="text-lg font-black text-slate-800">{pieChartData[0]?.name.split(' ')[0]}</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 space-y-2">
          {pieChartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-bold text-slate-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-900">${item.value.toFixed(0)}</span>
                <div className="w-12 text-right">
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                    {totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PieChartIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

export default AnalysisView;
