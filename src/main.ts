// 1. Импортируем типы и функции из модуля хранилища
import { loadTransactions, saveTransactions, Transaction } from './storage.js';

// 2. Находим элементы и принудительно указываем их тип через оператор "as" 
// Восклицательный знак (!) в конце говорит TS, что элемент точно существует в DOM
const balanceEl = document.getElementById('total-balance')!;
const incomeEl = document.getElementById('total-income')!;
const expenseEl = document.getElementById('total-expense')!;
const formEl = document.getElementById('transaction-form') as HTMLFormElement;
const textInput = document.getElementById('text') as HTMLInputElement;
const amountInput = document.getElementById('amount') as HTMLInputElement;
const typeInput = document.getElementById('type') as HTMLSelectElement;
const listEl = document.getElementById('transaction-list')!;

// 3. Указываем, что массив может состоять строго из объектов интерфейса Transaction
let transactions: Transaction[] = loadTransactions();

// 4. Функция расчета с явным указанием типов параметров в методах массивов
function updateValues(): void {
  const income: number = transactions
    .filter((t: Transaction) => t.type === 'income')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const expense: number = transactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const total: number = income - expense;

  balanceEl.textContent = total.toLocaleString('ru-RU');
  incomeEl.textContent = `+${income.toLocaleString('ru-RU')} ₸`;
  expenseEl.textContent = `-${expense.toLocaleString('ru-RU')} ₸`;
}

// 5. Типизируем функцию отрисовки карточки транзакции
function renderTransaction(transaction: Transaction): void {
  const li: HTMLLIElement = document.createElement('li');
  
  const isIncome: boolean = transaction.type === 'income';
  li.classList.add(isIncome ? 'income-item' : 'expense-item');

  li.innerHTML = `
    ${transaction.description} 
    <span class="amount">
      ${isIncome ? '+' : '-'}${transaction.amount.toLocaleString('ru-RU')} ₸
    </span>
    <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">&times;</button>
  `;

  listEl.appendChild(li);
}

// 6. Главная функция инициализации экрана
function init(): void {
  listEl.innerHTML = ''; 
  transactions.forEach(renderTransaction); 
  updateValues(); 
  saveTransactions(transactions); 
}

// 7. Типизируем событие отправки формы (e: SubmitEvent)
function addTransaction(e: SubmitEvent): void {
  e.preventDefault(); 

  // Создаем объект новой операции, который строго соответствует интерфейсу Transaction
  const newTransaction: Transaction = {
    id: Date.now().toString(), 
    description: textInput.value,
    amount: parseFloat(amountInput.value),
    // Принудительно кастим строку к типу 'income' | 'expense'
    type: typeInput.value as 'income' | 'expense' 
  };

  transactions.push(newTransaction);
  init();

  textInput.value = '';
  amountInput.value = '';
}

// 8. Чтобы функция удаления была видна из инлайн-атрибута onclick="..." в HTML,
// мы явно привязываем её к глобальному объекту window
(window as any).deleteTransaction = function(id: string): void {
  transactions = transactions.filter((t: Transaction) => t.id !== id);
  init(); 
};

// 9. Навешиваем слушатель
formEl.addEventListener('submit', addTransaction);

// Запуск при старте
init();
