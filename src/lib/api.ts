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

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

// Players API
export const playersApi = {
  getAll: () => fetchApi<PlayerItem[]>('/players'),
  create: async (data: Omit<PlayerItem, '_id'>) => {
    const result = await fetchApi<PlayerItem>('/players', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    emitUpdate('players:update');
    return result;
  },
  update: async (id: string, data: Partial<Omit<PlayerItem, '_id'>>) => {
    const result = await fetchApi<PlayerItem>(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    emitUpdate('players:update');
    return result;
  },
  delete: async (id: string) => {
    const result = await fetchApi<{ success: boolean }>(`/players/${id}`, {
      method: 'DELETE',
    });
    emitUpdate('players:update');
    return result;
  },
};

// News API
export const newsApi = {
  getAll: () => fetchApi<NewsItem[]>('/news'),
  create: async (data: Omit<NewsItem, '_id'>) => {
    const result = await fetchApi<NewsItem>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    emitUpdate('news:update');
    return result;
  },
  update: async (id: string, data: Partial<Omit<NewsItem, '_id'>>) => {
    const result = await fetchApi<NewsItem>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    emitUpdate('news:update');
    return result;
  },
  delete: async (id: string) => {
    const result = await fetchApi<{ success: boolean }>(`/news/${id}`, {
      method: 'DELETE',
    });
    emitUpdate('news:update');
    return result;
  },
};

// Media API
export const mediaApi = {
  getAll: () => fetchApi<MediaItem[]>('/media'),
  create: async (data: Omit<MediaItem, '_id'>) => {
    const result = await fetchApi<MediaItem>('/media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    emitUpdate('media:update');
    return result;
  },
  update: async (id: string, data: Partial<Omit<MediaItem, '_id'>>) => {
    const result = await fetchApi<MediaItem>(`/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    emitUpdate('media:update');
    return result;
  },
  delete: async (id: string) => {
    const result = await fetchApi<{ success: boolean }>(`/media/${id}`, {
      method: 'DELETE',
    });
    emitUpdate('media:update');
    return result;
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

// Аналогичные функции для других сущностей (teams, matches, tournaments)
// с добавлением emitUpdate для каждого изменения

export const teamsApi = {
  // ... аналогичные методы с emitUpdate
};

export const matchesApi = {
  // ... аналогичные методы с emitUpdate
};

export const tournamentsApi = {
  // ... аналогичные методы с emitUpdate
}; 