import React, { createContext, useContext, useEffect, type ReactNode, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { apiService } from '../services/api';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, surname: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Получаем данные пользователя через useQuery
  const {
    data: user,
    isLoading,
    refetch: checkAuth
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: apiService.getProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });

  // Мутация для логина
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // Выполняем логин
      const loginResult = await apiService.login({ email, password });

      // Если сервер вернул данные пользователя, используем их
      if ('name' in loginResult && 'email' in loginResult) {
        return loginResult;
      }

      // Если сервер вернул только { result: true }, запрашиваем профиль
      const userData = await apiService.getProfile();
      return userData;
    },
    onSuccess: (userData) => {
      // Обновляем кеш с данными пользователя
      queryClient.setQueryData(['auth', 'user'], userData);
    },
  });

  // Мутация для регистрации
  const registerMutation = useMutation({
    mutationFn: async ({
      name,
      surname,
      email,
      password
    }: {
      name: string;
      surname: string;
      email: string;
      password: string;
    }) => {
      const registerResult = await apiService.register({ name, surname, email, password });

      // Сервер возвращает { "success": true } при успешной регистрации
      if (registerResult && 'success' in registerResult && registerResult.success === true) {
        return;
      }

      throw new Error('Неожиданный ответ сервера');
    },
  });

  // Мутация для логаута
  const logoutMutation = useMutation({
    mutationFn: apiService.logout,
    onSuccess: () => {
      // Очищаем кеш пользователя
      queryClient.setQueryData(['auth', 'user'], null);
    },
    onError: () => {
      // Даже если запрос failed, очищаем локальное состояние
      queryClient.setQueryData(['auth', 'user'], null);
    },
  });

  // Функция для автоматического разлогинивания при истечении сессии
  const handleUnauthorized = useCallback(() => {
    console.log('Сессия истекла, автоматический разлогин');
    queryClient.setQueryData(['auth', 'user'], null);
  }, []);

  // Wrapper функции для сохранения совместимости с существующим API
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      return result;
    } catch (error) {
      throw error;
    }
  }, [loginMutation]);

  const register = useCallback(async (
    name: string,
    surname: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await registerMutation.mutateAsync({ name, surname, email, password });
    } catch (error) {
      console.error('AuthContext register error:', error);
      throw error;
    }
  }, [registerMutation]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      throw error;
    }
  }, [logoutMutation]);

  const checkAuthWrapper = useCallback(async (): Promise<void> => {
    await checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Устанавливаем колбэк для автоматического разлогинивания
    apiService.setUnauthorizedCallback(handleUnauthorized);
  }, [handleUnauthorized]);

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    login,
    register,
    logout,
    checkAuth: checkAuthWrapper,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};