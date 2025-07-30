import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../../../validation/schemas';
import { type AuthMode } from '../../../types/auth';
import "../AuthForm.scss"

import EmailIcon from '../../../assets/images/icon-email.svg?react';
import PasswordIcon from '../../../assets/images/icon-password.svg?react';

type Props = {
  switchMode: (mode: AuthMode) => void;
  onSubmit: (data: LoginFormData) => void;
  error?: string | null;
  isLoading?: boolean;
};

export const LoginForm = ({ switchMode, onSubmit, error, isLoading = false }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <>
      <form className='auth-form' onSubmit={handleSubmit(onSubmit)} >

        <div className='auth-form__field'>
          <div className={errors.email ? ("custom-input custom-input--error") : ("custom-input")}>
            <input className='custom-input__field' {...register('email')} type="email" placeholder='Электронная почта' />
            <EmailIcon className='custom-input__icon' width={24} height={24} aria-hidden={true} />
          </div>
          {errors.email && <span className="custom-input__error">{errors.email.message}</span>}
        </div>

        <div className='auth-form__field auth-form__field--last'>
          <div className={errors.password ? ("custom-input custom-input--error") : ("custom-input")}>
            <input className='custom-input__field' {...register('password')} type="password" placeholder='Пароль' />
            <PasswordIcon className='custom-input__icon' width={24} height={24} aria-hidden={true} />
          </div>
          {errors.password && <span className="custom-input__error">{errors.password.message}</span>}
        </div>

        {error && (
          <span className="auth-form__error">
            {error}
          </span>
        )}
        <button type="submit" className="btn btn--primary auth-form__submit">
          {isLoading ? 'Входим...' : 'Войти'}
        </button>
      </form>
      <button
        type="button"
        className="modal__link"
        onClick={() => switchMode('register')}
      >
        <span>
          Зарегистрироваться
        </span>
      </button>
    </>
  );
};