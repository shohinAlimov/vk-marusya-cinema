import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Повторять запрос только 1 раз при ошибке
      staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
      gcTime: 10 * 60 * 1000, // 10 минут - время жизни кеша
      refetchOnWindowFocus: false, // Не перезапрашивать при фокусе окна
      refetchOnReconnect: true, // Перезапрашивать при восстановлении сети
    },
    mutations: {
      retry: 0, // Не повторять мутации при ошибке
    },
  },
});

// Утилитные функции для работы с кешем аутентификации
export const invalidateAuthQueries = () => {
  queryClient.invalidateQueries({ queryKey: ['auth'] });
};

export const clearAuthCache = () => {
  queryClient.removeQueries({ queryKey: ['auth'] });
};