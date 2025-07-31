import { useState, useEffect } from "react";
import Modal from "../../ui/Modal/Modal";
import { LoginForm } from "../AuthForm/LoginForm/LoginForm";
import { RegisterForm } from "../AuthForm/RegisterForm/RegisterForm";
import { SuccessMessage } from "../SuccessMessage/SuccessMessage";
import { type AuthModalProps, type AuthMode } from "../../types/auth";
import type { LoginFormData, RegisterFormData } from "../../validation/schemas";
import { useAuth } from "../../contexts/AuthContext";

export const AuthModal = ({
  isOpen,
  onClose,
  defaultMode = "login",
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  // Блокировка прокрутки при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(data.email, data.password);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Произошла ошибка при входе"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await register(data.name, data.surname, data.email, data.password);
      setMode("success");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при регистрации"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    const searchElement = document.querySelector(".modal__content");
    if (searchElement) {
      searchElement.classList.add("closing");
    }
    // Сброс состояния при закрытии модалки
    setTimeout(() => {
      onClose();
      setMode(defaultMode);
      setError(null);
    }, 350);
  };

  // Сброс ошибки при смене режима
  const handleModeSwitch = (newMode: AuthMode) => {
    setError(null);
    setMode(newMode);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {mode === "login" && (
        <LoginForm
          switchMode={handleModeSwitch}
          onSubmit={handleLogin}
          error={error}
          isLoading={isLoading}
        />
      )}

      {mode === "register" && (
        <RegisterForm
          switchMode={handleModeSwitch}
          onSubmit={handleRegister}
          error={error}
          isLoading={isLoading}
        />
      )}

      {mode === "success" && <SuccessMessage switchMode={handleModeSwitch} />}
    </Modal>
  );
};
