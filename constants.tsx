
import { UserCategory, Transaction } from './types';

export const DEFAULT_CATEGORIES: UserCategory[] = [
  { id: 'cat_1', name: 'Food & Drinks', color: '#F87171' },
  { id: 'cat_2', name: 'Transport', color: '#60A5FA' },
  { id: 'cat_3', name: 'Shopping', color: '#FBBF24' },
  { id: 'cat_4', name: 'Entertainment', color: '#A78BFA' },
  { id: 'cat_5', name: 'Health', color: '#34D399' },
  { id: 'cat_6', name: 'Bills', color: '#F472B6' },
  { id: 'cat_7', name: 'Other', color: '#9CA3AF' },
];

export const CATEGORY_PRESET_COLORS = [
  '#F87171', '#FB923C', '#FBBF24', '#34D399', 
  '#22D3EE', '#60A5FA', '#818CF8', '#A78BFA', 
  '#F472B6', '#9CA3AF', '#475569', '#1E293B'
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
