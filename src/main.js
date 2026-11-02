import { loadTransactions, saveTransactions } from './storage.js';


// 1. Находим все нужные элементы на странице
const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const formEl = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const listEl = document.getElementById('transaction-list');

// 2. Инициализируем массив транзакций (пока пустой)
// Теперь при старте данные берутся из localStorage
let transactions = loadTransactions();

// 3. Функция для расчета общих сумм
function updateValues() {
  // Считаем общую сумму доходов
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Считаем общую сумму расходов
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Итоговый баланс
  const total = income - expense;

  // Выводим результаты на экран (с форматированием чисел)
  balanceEl.textContent = total.toLocaleString('ru-RU');
  incomeEl.textContent = `+${income.toLocaleString('ru-RU')} ₸`;
  expenseEl.textContent = `-${expense.toLocaleString('ru-RU')} ₸`;
}
// 4. Функция для отрисовки одной транзакции в HTML
function renderTransaction(transaction) {
  const li = document.createElement('li');
  
  // Добавляем класс в зависимости от типа операции (для CSS стилей полоски)
  const isIncome = transaction.type === 'income';
  li.classList.add(isIncome ? 'income-item' : 'expense-item');

  // Внутренняя верстка строки транзакции
  li.innerHTML = `
    ${transaction.description} 
    <span class="amount">
      ${isIncome ? '+' : '-'}${transaction.amount.toLocaleString('ru-RU')} ₸
    </span>
    <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">&times;</button>
  `;

  listEl.appendChild(li);
}

// 5. Главная функция отрисовки всего интерфейса
function init() {
  listEl.innerHTML = ''; // Очищаем список перед перерисовкой
  transactions.forEach(renderTransaction); // Рисуем каждую транзакцию
  updateValues(); // Обновляем баланс, доходы и расходы
  saveTransactions(transactions); 
}
// 6. Функция добавления новой транзакции из формы
function addTransaction(e) {
  e.preventDefault(); // Запрещаем перезагрузку страницы

  // Создаем объект новой операции
  const newTransaction = {
    id: Date.now().toString(), // Уникальный ID на основе времени
    description: textInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value
  };

  // Пушим в массив и обновляем интерфейс
  transactions.push(newTransaction);
  init();

  // Очищаем поля формы
  textInput.value = '';
  amountInput.value = '';
}

// 7. Функция удаления транзакции (вызывается по кнопке-крестику)
window.deleteTransaction = function(id) {
  // Фильтруем массив, оставляя все элементы, кроме удаляемого
  transactions = transactions.filter(t => t.id !== id);
  init(); // Перерисовываем экран
};

// 8. Вешаем слушатель события на форму
formEl.addEventListener('submit', addTransaction);

// Запускаем приложение при старте
init();
