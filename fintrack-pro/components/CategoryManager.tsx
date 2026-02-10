
import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { UserCategory } from '../types';
import { CATEGORY_PRESET_COLORS } from '../constants';

interface CategoryManagerProps {
  categories: UserCategory[];
  onAddCategory: (category: Omit<UserCategory, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_PRESET_COLORS[0]);
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddCategory({ name: newName.trim(), color: selectedColor });
    setNewName('');
    setShowAdd(false);
  };

  return (
    <div className="px-5 py-6 space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Vault Categories</h3>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={`p-3 rounded-2xl transition-all shadow-sm ${showAdd ? 'bg-rose-50 text-rose-600 rotate-45' : 'bg-indigo-600 text-white shadow-indigo-100'}`}
        >
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-indigo-50 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center">
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">New Category</span>
             <button onClick={() => setShowAdd(false)}><X size={18} className="text-slate-300" /></button>
          </div>
          
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category Label..."
            className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none rounded-2xl py-4 px-5 text-slate-800 font-bold placeholder:text-slate-300"
          />
          
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Visual ID</span>
            <div className="grid grid-cols-6 gap-3">
              {CATEGORY_PRESET_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`aspect-square rounded-full border-4 transition-all active:scale-90 ${selectedColor === color ? 'border-indigo-200 scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Check size={20} strokeWidth={3} />
            Create Category
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-[2rem] flex items-center justify-between border border-slate-100 shadow-sm hover:border-indigo-100 transition-all group">
            <div className="flex items-center gap-5">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                style={{ 
                    backgroundColor: cat.color,
                    boxShadow: `0 8px 20px -6px ${cat.color}66`
                }}
              >
                {cat.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-base">{cat.name}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Active Label</span>
              </div>
            </div>
            {categories.length > 1 && (
              <button 
                onClick={() => onDeleteCategory(cat.id)}
                className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
