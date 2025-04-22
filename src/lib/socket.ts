import { io } from 'socket.io-client';

// Создаем подключение к WebSocket серверу
const socket = io('https://pomidorkaeg.github.io', {
  path: '/fdsfsd/socket.io',
  transports: ['websocket'],
  autoConnect: true
});

// Типы событий для обновления данных
export type UpdateEvent = 
  | 'players:update'
  | 'coaches:update'
  | 'teams:update'
  | 'news:update'
  | 'media:update'
  | 'matches:update'
  | 'tournaments:update';

// Функция для подписки на обновления
export const subscribeToUpdates = (event: UpdateEvent, callback: (data: any) => void) => {
  socket.on(event, callback);
  return () => socket.off(event, callback);
};

// Функция для отправки обновлений
export const emitUpdate = (event: UpdateEvent, data: any) => {
  socket.emit(event, data);
};

// Обработка ошибок подключения
socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

export default socket; 