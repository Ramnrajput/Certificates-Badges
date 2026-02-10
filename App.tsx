
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2, BrainCircuit, Undo2, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { Tab, Transaction, UserCategory } from './types';
import { INITIAL_TRANSACTIONS, DEFAULT_CATEGORIES } from './constants';
import Layout from './components/Layout';
import TransactionForm from './components/TransactionForm';
import AnalysisView from './components/AnalysisView';
import SplashScreen from './components/SplashScreen';
import CategoryManager from './components/CategoryManager';
import { getFinancialAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<UserCategory[]>(() => {
    const saved = localStorage.getItem('fin_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<{ item: Transaction; index: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_categories', JSON.stringify(categories));
  }, [categories]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === 'expense') acc.expense += t.amount;
        else acc.income += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = totals.income - totals.expense;

  const handleAddTransaction = (newT: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newT,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleAddCategory = (newCat: Omit<UserCategory, 'id'>) => {
    const category: UserCategory = {
      ...newCat,
      id: `cat_${Date.now()}`
    };
    setCategories(prev => [...prev, category]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const deleteTransaction = (id: string) => {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      const itemToDelete = transactions[index];
      setLastDeleted({ item: itemToDelete, index });
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Auto-dismiss undo after 6 seconds
      setTimeout(() => {
        setLastDeleted(current => current?.item.id === id ? null : current);
      }, 6000);
    }
  };

  const handleUndoDelete = () => {
    if (lastDeleted) {
      const restored = [...transactions];
      restored.splice(lastDeleted.index, 0, lastDeleted.item);
      setTransactions(restored);
      setLastDeleted(null);
    }
  };

  const fetchAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(transactions);
    setAiAdvice(advice || "No advice available yet.");
    setIsAiLoading(false);
  };

  const renderHome = () => (
    <div className="px-5 py-6 space-y-6 animate-in slide-in-from-right duration-300">
      {/* Hero Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-8 -mb-8 blur-2xl"></div>
        <div className="relative z-10 text-center">
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Current Balance</p>
          <h2 className="text-5xl font-black mb-8 tracking-tighter">
            <span className="text-2xl opacity-60 font-medium mr-1">$</span>
            {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center mb-2">
                <ArrowUpRight size={16} className="text-emerald-300" />
              </div>
              <p className="text-[10px] font-bold text-white/50 uppercase">Income</p>
              <p className="text-sm font-black text-white">${totals.income.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-rose-400/20 flex items-center justify-center mb-2">
                <ArrowDownLeft size={16} className="text-rose-300" />
              </div>
              <p className="text-[10px] font-bold text-white/50 uppercase">Expenses</p>
              <p className="text-sm font-black text-white">${totals.expense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => setActiveTab('analysis')}
          className="bg-orange-50 p-5 rounded-[2rem] border border-orange-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-orange-100">
            <TrendingUp size={24} />
          </div>
          <span className="text-sm font-bold text-orange-900">Analytics</span>
          <span className="text-[10px] text-orange-600 font-medium mt-1">Visual Insights</span>
        </div>
        <div 
          onClick={() => setActiveTab('ai')}
          className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-indigo-100">
            <BrainCircuit size={24} />
          </div>
          <span className="text-sm font-bold text-indigo-900">AI Advisor</span>
          <span className="text-[10px] text-indigo-600 font-medium mt-1">Financial Tips</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Activity</h3>
        <button onClick={() => setActiveTab('history')} className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 transition-colors">See All</button>
      </div>

      <div className="space-y-3">
        {sortedTransactions.slice(0, 4).map(t => {
          const categoryInfo = categories.find(c => c.name === t.category);
          return (
            <div key={t.id} className="bg-white p-4 rounded-[1.5rem] flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: categoryInfo?.color || '#94a3b8' }}
                >
                  <span className="text-lg font-black">{t.category.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm">{t.note}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-base ${t.type === 'expense' ? 'text-slate-900' : 'text-emerald-600'}`}>
                  {t.type === 'expense' ? '-' : '+'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          );
        })}
        {transactions.length === 0 && (
          <div className="py-16 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Wallet size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 text-sm font-bold">Your vault is currently empty</p>
            <p className="text-slate-300 text-xs mt-1">Tap the plus to add your first record</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="px-5 py-6 space-y-4 animate-in slide-in-from-right duration-300">
      {sortedTransactions.map(t => {
        const categoryInfo = categories.find(c => c.name === t.category);
        return (
          <div key={t.id} className="bg-white p-5 rounded-[2rem] flex items-center justify-between border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center text-white text-xl font-black shadow-lg"
                style={{ 
                  backgroundColor: categoryInfo?.color || '#94a3b8',
                  boxShadow: `0 8px 16px -4px ${categoryInfo?.color}44`
                }}
              >
                {t.category.charAt(0)}
              </div>
              <div>
                <p className="font-black text-slate-800">{t.note}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">{t.category}</span>
                  <span className="text-slate-200 font-bold">•</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={`font-black text-lg ${t.type === 'expense' ? 'text-slate-900' : 'text-emerald-600'}`}>
                {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
              </p>
              <button 
                onClick={() => deleteTransaction(t.id)}
                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderAiTips = () => (
    <div className="px-5 py-6 space-y-6 animate-in slide-in-from-right duration-300">
      <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -top-10 -right-10 opacity-10">
          <BrainCircuit size={200} />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-3 tracking-tighter">Smart Insights</h3>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
            Personalized advice driven by your spending patterns.
          </p>
          <button
            onClick={fetchAdvice}
            disabled={isAiLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[1.5rem] font-black text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95"
          >
            {isAiLoading ? (
              <span className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
            ) : (
              <>
                <BrainCircuit size={22} />
                Generate Audit
              </>
            )}
          </button>
        </div>
      </div>

      {aiAdvice && (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom duration-500">
          <h4 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
            <div className="w-2 h-8 bg-blue-600 rounded-full" />
            AI Audit Report
          </h4>
          <div className="text-slate-600 space-y-5">
            {aiAdvice.split('\n').filter(l => l.trim()).map((line, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-200 group-hover:bg-blue-500 transition-colors shrink-0" />
                <p className="text-sm leading-relaxed font-medium">{line.replace(/^[*-]\s*/, '')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (showSplash) return <SplashScreen />;

  return (
    <div className="animate-in fade-in duration-1000">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'analysis' && <AnalysisView transactions={transactions} categories={categories} />}
        {activeTab === 'categories' && <CategoryManager categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />}
        {activeTab === 'ai' && renderAiTips()}

        {/* Action Button */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-28 right-6 w-16 h-16 bg-slate-950 text-white rounded-[1.75rem] shadow-2xl shadow-slate-400 flex items-center justify-center hover:bg-slate-800 active:scale-90 transition-all z-[60]"
        >
          <Plus size={32} strokeWidth={3} />
        </button>

        {/* Undo Toast */}
        {lastDeleted && (
          <div className="fixed bottom-28 left-6 right-24 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-full z-[70] border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-rose-500 rounded-full" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deleted</span>
                <span className="text-sm font-bold truncate max-w-[120px]">{lastDeleted.item.note}</span>
              </div>
            </div>
            <button 
              onClick={handleUndoDelete}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-500 transition-colors"
            >
              <Undo2 size={14} />
              UNDO
            </button>
          </div>
        )}

        {isFormOpen && (
          <TransactionForm
            categories={categories}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleAddTransaction}
          />
        )}
      </Layout>
    </div>
  );
};

export default App;
