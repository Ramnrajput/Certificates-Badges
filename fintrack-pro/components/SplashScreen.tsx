
import React, { useEffect, useState } from 'react';
import { Wallet, Sparkles } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200 animate-bounce">
          <Wallet size={48} className="text-white" />
        </div>
        <div className="absolute -top-2 -right-2 text-blue-500 animate-pulse">
          <Sparkles size={24} />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
          FinTrack<span className="text-blue-600">Pro</span>
        </h1>
        <p className="text-slate-400 font-medium tracking-widest text-[10px] uppercase">
          Master Your Wealth
        </p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-4">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-slate-300 text-[10px] font-bold">SECURE & PRIVATE</p>
      </div>
    </div>
  );
};

export default SplashScreen;
