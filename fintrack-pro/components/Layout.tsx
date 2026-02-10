
import React from 'react';
import { Home, History, PieChart, Sparkles, Tags } from 'lucide-react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Vault' },
    { id: 'history', icon: History, label: 'Records' },
    { id: 'analysis', icon: PieChart, label: 'Insights' },
    { id: 'categories', icon: Tags, label: 'Labels' },
    { id: 'ai', icon: Sparkles, label: 'Advisor' },
  ];

  const getTitle = () => {
    switch(activeTab) {
      case 'home': return 'My Vault';
      case 'history': return 'Transaction Log';
      case 'analysis': return 'Spend Analytics';
      case 'categories': return 'Manage Labels';
      case 'ai': return 'Smart Advisor';
      default: return 'FinTrack';
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#FBFBFE] shadow-2xl overflow-hidden relative border-x border-slate-100">
      <header className="px-6 pt-10 pb-4 bg-white/80 backdrop-blur-md border-b border-slate-50 shrink-0 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-xl font-black text-slate-950 tracking-tight">
          {getTitle()}
        </h1>
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">FP</div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {children}
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
        <nav className="bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] px-4 py-3 flex justify-around items-center shadow-2xl shadow-slate-200 pointer-events-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative px-3 py-1 ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              {activeTab === item.id && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              )}
              <item.icon size={20} strokeWidth={activeTab === item.id ? 3 : 2} className={activeTab === item.id ? 'scale-110' : ''} />
              <span className={`text-[8px] font-black uppercase tracking-wider ${activeTab === item.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
