import React, { useState, useEffect } from 'react';
// Импортируем нашу логику работы с localStorage и типы из TS-этапа
import { loadTransactions, saveTransactions, Transaction } from './storage';

export default function App() {
  // 1. Создаем реактивное состояние для массива транзакций
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  // 2. Состояния для полей формы
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  // 3. Каждый раз, когда массив transactions меняется, автоматически сохраняем его в localStorage
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // 4. Вычисляем баланс, доходы и расходы на лету при каждом изменении состояния
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = income - expense;

  // 5. Функция добавления новой транзакции
  const handleAddTransaction = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: description,
      amount: parseFloat(amount),
      type: type
    };

    // Обновляем состояние: создаем новый массив, копируя старый и добавляя новый элемент
    setTransactions([...transactions, newTransaction]);

    // Очищаем инпуты
    setDescription('');
    setAmount('');
  };

  // 6. Функция удаления транзакции
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // 7. Возвращаем JSX-разметку (тот самый HTML, который мы перенесли из index.html)
  return (
    <div className="container">
      <h1>Умный трекер финансов (React + TS)</h1>

      {/* Блок общего баланса */}
      <div className="balance-board">
        <h2>Ваш баланс: <span id="total-balance">{totalBalance.toLocaleString('ru-RU')}</span> ₸</h2>
        <div className="stats">
          <div className="stat-box income">
            <h3>Доходы</h3>
            <p>+{income.toLocaleString('ru-RU')} ₸</p>
          </div>
          <div className="stat-box expense">
            <h3>Расходы</h3>
            <p>-{expense.toLocaleString('ru-RU')} ₸</p>
          </div>
        </div>
      </div>

      {/* Форма добавления операции */}
      <div className="transaction-form-box">
        <h3>Добавить операцию</h3>
        <form onSubmit={handleAddTransaction}>
          <div className="form-group">
            <label>Описание</label>
            <input 
              type="text" 
              placeholder="Например: Продукты, Зарплата..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Сумма</label>
            <input 
              type="number" 
              placeholder="Введите сумму..." 
              min="1" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Тип операции</label>
            <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
              <option value="expense">Расход</option>
              <option value="income">Доход</option>
            </select>
          </div>
          <button type="submit" className="btn">Добавить</button>
        </form>
      </div>

      {/* Список истории операций */}
      <div className="history-box">
        <h3>История операций</h3>
        <ul className="list">
          {transactions.map((transaction) => (
            <li 
              key={transaction.id} 
              className={transaction.type === 'income' ? 'income-item' : 'expense-item'}
            >
              {transaction.description} 
              <span className="amount">
                {transaction.type === 'income' ? '+' : '-'}
                {transaction.amount.toLocaleString('ru-RU')} ₸
              </span>
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteTransaction(transaction.id)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
