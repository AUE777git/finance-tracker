// Ключ, по которому данные будут лежать в браузере
const STORAGE_KEY = 'finance_tracker_transactions';

// Функция для загрузки данных из localStorage
export function loadTransactions() {
  const data = localStorage.getItem(STORAGE_KEY);
  // Если данные есть, превращаем строку обратно в массив объектов (JSON.parse).
  // Если данных нет, возвращаем пустой массив [].
  return data ? JSON.parse(data) : [];
}

// Функция для сохранения данных в localStorage
export function saveTransactions(transactions) {
  // localStorage умеет хранить только строки, поэтому превращаем массив в строку через JSON.stringify
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
