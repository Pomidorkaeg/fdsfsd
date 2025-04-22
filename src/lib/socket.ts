import { io } from 'socket.io-client';
import { clearCache } from './api';

// Используем реальный URL вашего сервера
export const socket = io('https://bds-server.onrender.com', {
  reconnection: true,
  reconnectionAttempts: Infinity, // Бесконечные попытки переподключения
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ['websocket', 'polling'], // Поддержка fallback на polling
  autoConnect: true, // Автоматическое подключение при создании
});

// Типы событий для обновления данных
export type UpdateEvent = 
  | 'players:update'
  | 'coaches:update'
  | 'news:update'
  | 'teams:update'
  | 'matches:update'
  | 'tournaments:update'
  | 'media:update';

// Функция для подписки на обновления
export const subscribeToUpdates = (event: UpdateEvent, callback: () => void) => {
  // При подписке на обновления сразу очищаем кэш
  clearCache();
  
  socket.on(event, () => {
    // При получении события обновления очищаем кэш и вызываем callback
    clearCache();
    callback();
  });
  
  // Если сокет не подключен, пытаемся подключиться
  if (!socket.connected) {
    socket.connect();
  }
  
  return () => {
    socket.off(event, callback);
  };
};

// Функция для отправки обновлений
export const emitUpdate = (event: UpdateEvent, data?: any) => {
  // Очищаем кэш перед отправкой обновления
  clearCache();
  
  if (socket.connected) {
    socket.emit(event, data);
  } else {
    // Если сокет не подключен, ставим в очередь и отправляем после подключения
    socket.once('connect', () => {
      socket.emit(event, data);
    });
    socket.connect();
  }
};

// Добавляем обработчики событий подключения
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
  // При переподключении очищаем весь кэш
  clearCache();
  // Запрашиваем актуальные данные
  emitUpdate('players:update');
  emitUpdate('news:update');
  emitUpdate('media:update');
  emitUpdate('coaches:update');
  emitUpdate('teams:update');
  emitUpdate('matches:update');
  emitUpdate('tournaments:update');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
  // При отключении очищаем кэш
  clearCache();
  // Автоматически пытаемся переподключиться
  socket.connect();
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // При ошибке подключения очищаем кэш
  clearCache();
  // Пытаемся переподключиться с небольшой задержкой
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

export default socket; 