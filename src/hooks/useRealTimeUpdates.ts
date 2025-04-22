import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeToUpdates, UpdateEvent } from '@/lib/socket';

export const useRealTimeUpdates = (event: UpdateEvent, queryKey: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Подписываемся на обновления
    const unsubscribe = subscribeToUpdates(event, (data) => {
      // Инвалидируем кеш при получении обновлений
      queryClient.invalidateQueries({ queryKey });
      
      // Обновляем данные в кеше
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (Array.isArray(oldData)) {
          // Если это массив, обновляем или добавляем новые элементы
          const newData = [...oldData];
          data.forEach((item: any) => {
            const index = newData.findIndex((old: any) => old.id === item.id);
            if (index !== -1) {
              newData[index] = item;
            } else {
              newData.push(item);
            }
          });
          return newData;
        }
        // Если это одиночный объект, просто заменяем его
        return data;
      });
    });

    // Отписываемся при размонтировании компонента
    return () => {
      unsubscribe();
    };
  }, [event, queryClient, queryKey]);
}; 