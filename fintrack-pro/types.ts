
export type TransactionType = 'expense' | 'income';

export interface UserCategory {
  id: string;
  name: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string; // Now refers to UserCategory.name
  type: TransactionType;
  date: string;
  note: string;
}

export interface SpendingData {
  name: string;
  value: number;
  color: string;
}

export type Tab = 'home' | 'history' | 'analysis' | 'categories' | 'ai';
