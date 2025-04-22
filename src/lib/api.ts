import { emitUpdate } from './socket';

// Базовый URL API
const API_BASE_URL = 'https://pomidorkaeg.github.io/fdsfsd/api';

// Общая функция для выполнения запросов
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Функции для работы с игроками
export const playersApi = {
  async getAll() {
    return fetchApi('/players');
  },
  async create(data: any) {
    const result = await fetchApi('/players', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    emitUpdate('players:update', result);
    return result;
  },
  async update(id: string, data: any) {
    const result = await fetchApi(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    emitUpdate('players:update', result);
    return result;
  },
  async delete(id: string) {
    await fetchApi(`/players/${id}`, { method: 'DELETE' });
    emitUpdate('players:update', { id, deleted: true });
  },
};

// Функции для работы с тренерами
export const coachesApi = {
  async getAll() {
    return fetchApi('/coaches');
  },
  async create(data: any) {
    const result = await fetchApi('/coaches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    emitUpdate('coaches:update', result);
    return result;
  },
  async update(id: string, data: any) {
    const result = await fetchApi(`/coaches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    emitUpdate('coaches:update', result);
    return result;
  },
  async delete(id: string) {
    await fetchApi(`/coaches/${id}`, { method: 'DELETE' });
    emitUpdate('coaches:update', { id, deleted: true });
  },
};

// Функции для работы с новостями
export const newsApi = {
  async getAll() {
    return fetchApi('/news');
  },
  async create(data: any) {
    const result = await fetchApi('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    emitUpdate('news:update', result);
    return result;
  },
  async update(id: string, data: any) {
    const result = await fetchApi(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    emitUpdate('news:update', result);
    return result;
  },
  async delete(id: string) {
    await fetchApi(`/news/${id}`, { method: 'DELETE' });
    emitUpdate('news:update', { id, deleted: true });
  },
};

// Аналогичные функции для других сущностей (teams, media, matches, tournaments)
// с добавлением emitUpdate для каждого изменения

export const teamsApi = {
  // ... аналогичные методы с emitUpdate
};

export const mediaApi = {
  // ... аналогичные методы с emitUpdate
};

export const matchesApi = {
  // ... аналогичные методы с emitUpdate
};

export const tournamentsApi = {
  // ... аналогичные методы с emitUpdate
}; 