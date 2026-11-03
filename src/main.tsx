import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // Импортируем наши стили напрямую в JS/TS, Vite это умеет!

// Находим корневой элемент в HTML и монтируем туда наше React-приложение
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
