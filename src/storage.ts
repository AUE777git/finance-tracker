const STORAGE_KEY = 'finance_tracker_transactions';

// 1. Описываем структуру нашей транзакции
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense'; // тип может быть строго только одной из двух этих строк
}

// 2. Указываем, что функция возвращает массив транзакций: Transaction[]
export function loadTransactions(): Transaction[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 3. Указываем, что параметр transactions должен быть массивом: Transaction[]
export function saveTransactions(transactions: Transaction[]): void {
  // void означает, что функция ничего не возвращает
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
