export type AuthInfo = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name: string;
  surname: string;
};

export type User = {
  name: string;
  surname: string;
  email: string;
  favorites: string[];
};

export type SuccessfulResult = {
  success: boolean;
};

// Обновите типы для методов API, которые могут возвращать разные типы
export type LoginResponse = User | SuccessfulResult;
export type RegisterResponse = User | SuccessfulResult;

export type AuthMode = 'login' | 'register' | 'success';

export type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
};