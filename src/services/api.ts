import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Movie } from "../types/movie.ts";
import type {
  AuthInfo,
  RegisterData,
  SuccessfulResult,
  User,
  LoginResponse,
  RegisterResponse,
} from "../types/auth.ts";

class ApiService {
  private api: AxiosInstance;
  private baseURL = "https://cinemaguide.skillbox.cc";
  private onUnauthorized?: () => void;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        language: "ru-RU",
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Сессия истекла, вызываем колбэк для разлогинивания
          this.onUnauthorized?.();
        }
        return Promise.reject(error);
      }
    );
  }

  // Метод для установки колбэка при истечении сессии
  setUnauthorizedCallback(callback: () => void) {
    this.onUnauthorized = callback;
  }

  // Получение случайного фильма
  async getRandomMovie(): Promise<Movie> {
    try {
      const response = await this.api.get<Movie>("/movie/random");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении случайного фильма:", error);
      throw new Error("Не удалось загрузить случайный фильм");
    }
  }

  // Получение списка всех фильмов
  async getMovies(count?: number): Promise<Movie[]> {
    try {
      const params: { count?: number } = {};

      if (count !== undefined) {
        params.count = count;
      } else {
        params.count = 10000;
      }

      const response = await this.api.get<Movie[]>("/movie", { params });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении фильмов:", error);
      throw new Error("Не удалось загрузить фильмы");
    }
  }

  // Поиск фильмов по названию
  async searchMovies(title: string): Promise<Movie[]> {
    try {
      const response = await this.api.get<Movie[]>("/movie", {
        params: {
          title: title,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при поиске фильмов:", error);
      throw new Error("Не удалось найти фильмы");
    }
  }

  // Получение фильмов по жанру
  // Получение фильмов по жанру
  async getMoviesByGenre(
    genre: string,
    page: number = 1,
    count: number = 10
  ): Promise<Movie[]> {
    try {
      const response = await this.api.get<Movie[]>("/movie", {
        params: {
          genre,
          page,
          count,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении фильмов по жанру:", error);
      throw new Error("Не удалось загрузить фильмы по жанру");
    }
  }

  // Получение топ-10 фильмов
  async getTopMovies(count: number = 10): Promise<Movie[]> {
    try {
      const response = await this.api.get<Movie[]>(`/movie/top10`);
      return response.data.slice(0, count);
    } catch (error) {
      console.error("Ошибка при получении топ фильмов:", error);
      throw new Error("Не удалось загрузить топ фильмов");
    }
  }

  // Получение списка жанров
  async getGenres(): Promise<string[]> {
    try {
      const response = await this.api.get<string[]>("/movie/genres");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении жанров:", error);
      throw new Error("Не удалось загрузить жанры");
    }
  }

  // Получение информации о конкретном фильме
  async getMovieById(id: number): Promise<Movie> {
    try {
      const response = await this.api.get<Movie>(`/movie/${id}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении фильма:", error);
      throw new Error("Не удалось загрузить фильм");
    }
  }

  // Логин пользователя
  async login(authData: AuthInfo): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>(
        "/auth/login",
        authData
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при входе:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Емайл или пароль неверный");
        } else if (error.response?.status === 400) {
          throw new Error("Некорректные данные для входа");
        }
      }

      throw new Error("Не удалось войти в систему");
    }
  }

  // Выход
  async logout(): Promise<SuccessfulResult> {
    try {
      const response = await this.api.get<SuccessfulResult>("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      throw new Error("Не удалось выйти из системы");
    }
  }

  // Регистрация
  async register(registerData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await this.api.post<RegisterResponse>(
        "/user",
        registerData
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error("Пользователь с таким email уже существует");
        } else if (error.response?.status === 400) {
          const errorData = error.response.data;
          // Проверяем, есть ли более детальная информация об ошибке
          if (
            errorData &&
            typeof errorData === "object" &&
            "message" in errorData
          ) {
            throw new Error(errorData.message);
          }
          throw new Error("Некорректные данные для регистрации");
        }
      }

      throw new Error("Не удалось зарегистрироваться");
    }
  }

  // Получение профиля
  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<User>("/profile");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Необходимо войти в систему");
        }
      }

      throw new Error("Не удалось загрузить профиль");
    }
  }

  // Добавляем в ApiService новые методы для работы с избранными

  // Получение избранных фильмов
  async getFavorites(): Promise<Movie[]> {
    try {
      const response = await this.api.get<Movie[]>("/favorites");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении избранных фильмов:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Необходимо войти в систему");
        }
      }

      throw new Error("Не удалось загрузить избранные фильмы");
    }
  }

  // Добавление фильма в избранное
  async addToFavorites(movieId: number): Promise<SuccessfulResult> {
    try {
      const response = await this.api.post<SuccessfulResult>("/favorites", {
        id: movieId.toString(),
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Необходимо войти в систему");
        } else if (error.response?.status === 409) {
          throw new Error("Фильм уже добавлен в избранное");
        }
      }

      throw new Error("Не удалось добавить фильм в избранное");
    }
  }

  // Удаление фильма из избранного
  async removeFromFavorites(movieId: number): Promise<SuccessfulResult> {
    try {
      const response = await this.api.delete<SuccessfulResult>(
        `/favorites/${movieId}`
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Необходимо войти в систему");
        } else if (error.response?.status === 404) {
          throw new Error("Фильм не найден в избранном");
        }
      }

      throw new Error("Не удалось удалить фильм из избранного");
    }
  }
}

export const apiService = new ApiService();
