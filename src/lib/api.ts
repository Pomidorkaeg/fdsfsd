import { emitUpdate } from './socket';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
}

interface PlayerItem {
  _id: string;
  name: string;
  position: string;
  number: number;
  image?: string;
}

interface MediaItem {
  _id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  date: string;
}

const API_BASE_URL = 'https://bds-server.onrender.com/api';

// Добавляем кэширование и повторные попытки
const cache = new Map();
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 0): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries + 1);
    }
    throw error;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Для GET запросов используем кэш
  if (options.method === undefined || options.method === 'GET') {
    const cached = cache.get(url);
    if (cached) {
      return cached;
    }
  }

  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  
  // Кэшируем только GET запросы
  if (options.method === undefined || options.method === 'GET') {
    cache.set(url, data);
  }

  return data;
}

// Функция для очистки кэша
export const clearCache = () => {
  cache.clear();
};

// Players API
export const playersApi = {
  getAll: async () => {
    const data = await fetchApi<PlayerItem[]>('/players');
    return data;
  },
  create: async (data: Omit<PlayerItem, '_id'>) => {
    const result = await fetchApi<PlayerItem>('/players', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    clearCache(); // Очищаем кэш при изменении данных
    emitUpdate('players:update', result);
    return result;
  },
  update: async (id: string, data: Partial<Omit<PlayerItem, '_id'>>) => {
    const result = await fetchApi<PlayerItem>(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('players:update', result);
    return result;
  },
  delete: async (id: string) => {
    const result = await fetchApi<{ success: boolean }>(`/players/${id}`, {
      method: 'DELETE',
    });
    clearCache();
    emitUpdate('players:update', { id, deleted: true });
    return result;
  },
};

// News API
export const newsApi = {
  getAll: async () => {
    const data = await fetchApi<NewsItem[]>('/news');
    return data;
  },
  create: async (data: Omit<NewsItem, '_id'>) => {
    const result = await fetchApi<NewsItem>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('news:update', result);
    return result;
  },
  update: async (id: string, data: Partial<Omit<NewsItem, '_id'>>) => {
    const result = await fetchApi<NewsItem>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('news:update', result);
    return result;
  },
  delete: async (id: string) => {
    const result = await fetchApi<{ success: boolean }>(`/news/${id}`, {
      method: 'DELETE',
    });
    clearCache();
    emitUpdate('news:update', { id, deleted: true });
    return result;
  },
};

// Media API
export const mediaApi = {
  getAll: async () => {
    const data = await fetchApi<MediaItem[]>('/media');
    return data;
  },
  create: async (data: Omit<MediaItem, '_id'>) => {
    const result = await fetchApi<MediaItem>('/media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('media:update', result);
    return result;
  },
  update: async (id: string, data: Partial<Omit<MediaItem, '_id'>>) => {
    const result = await fetchApi<MediaItem>(`/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('media:update', result);
    return result;
  },
  delete: async (id: string) => {
    const result = await fetchApi<{ success: boolean }>(`/media/${id}`, {
      method: 'DELETE',
    });
    clearCache();
    emitUpdate('media:update', { id, deleted: true });
    return result;
  },
};

// Функции для работы с тренерами
export const coachesApi = {
  getAll: async () => {
    const data = await fetchApi('/coaches');
    return data;
  },
  create: async (data: any) => {
    const result = await fetchApi('/coaches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('coaches:update', result);
    return result;
  },
  update: async (id: string, data: any) => {
    const result = await fetchApi(`/coaches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('coaches:update', result);
    return result;
  },
  delete: async (id: string) => {
    await fetchApi(`/coaches/${id}`, { method: 'DELETE' });
    clearCache();
    emitUpdate('coaches:update', { id, deleted: true });
  },
};

// Аналогичные функции для других сущностей (teams, matches, tournaments)
// с добавлением emitUpdate для каждого изменения

export const teamsApi = {
  getAll: async () => {
    const data = await fetchApi('/teams');
    return data;
  },
  create: async (data: any) => {
    const result = await fetchApi('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('teams:update', result);
    return result;
  },
  update: async (id: string, data: any) => {
    const result = await fetchApi(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('teams:update', result);
    return result;
  },
  delete: async (id: string) => {
    await fetchApi(`/teams/${id}`, { method: 'DELETE' });
    clearCache();
    emitUpdate('teams:update', { id, deleted: true });
  },
};

export const matchesApi = {
  getAll: async () => {
    const data = await fetchApi('/matches');
    return data;
  },
  create: async (data: any) => {
    const result = await fetchApi('/matches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('matches:update', result);
    return result;
  },
  update: async (id: string, data: any) => {
    const result = await fetchApi(`/matches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('matches:update', result);
    return result;
  },
  delete: async (id: string) => {
    await fetchApi(`/matches/${id}`, { method: 'DELETE' });
    clearCache();
    emitUpdate('matches:update', { id, deleted: true });
  },
};

export const tournamentsApi = {
  getAll: async () => {
    const data = await fetchApi('/tournaments');
    return data;
  },
  create: async (data: any) => {
    const result = await fetchApi('/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('tournaments:update', result);
    return result;
  },
  update: async (id: string, data: any) => {
    const result = await fetchApi(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    clearCache();
    emitUpdate('tournaments:update', result);
    return result;
  },
  delete: async (id: string) => {
    await fetchApi(`/tournaments/${id}`, { method: 'DELETE' });
    clearCache();
    emitUpdate('tournaments:update', { id, deleted: true });
  },
}; 