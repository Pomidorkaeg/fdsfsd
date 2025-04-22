import { io } from 'socket.io-client';

// Используем реальный URL вашего сервера
export const socket = io('https://bds-server.onrender.com', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
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
  socket.on(event, callback);
  return () => {
    socket.off(event, callback);
  };
};

// Функция для отправки обновлений
export const emitUpdate = (event: UpdateEvent) => {
  socket.emit(event);
};

// Добавляем обработчики событий подключения
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket; 