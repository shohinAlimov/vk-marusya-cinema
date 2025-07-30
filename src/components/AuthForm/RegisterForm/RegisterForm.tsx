import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../../../validation/schemas';
import { type AuthMode } from '../../../types/auth';

import EmailIcon from '../../../assets/images/icon-email.svg?react';
import PasswordIcon from '../../../assets/images/icon-password.svg?react';
import UserIcon from '../../../assets/images/icon-user.svg?react';

type Props = {
  switchMode: (mode: AuthMode) => void;
  onSubmit: (data: RegisterFormData) => void;
  error?: string | null;
  isLoading?: boolean;
};

export const RegisterForm = ({ switchMode, onSubmit, error, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  return (
    <>
      <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>

        <div className='auth-form__field'>
          <div className={errors.email ? ("custom-input custom-input--error") : ("custom-input")}>
            <input className='custom-input__field' {...register('email')} type="email" placeholder='Электронная почта' />
            <EmailIcon className='custom-input__icon' width={24} height={24} aria-hidden={true} />
          </div>
          {errors.email && <span className="custom-input__error">{errors.email.message}</span>}
        </div>

        <div className='auth-form__field'>
          <div className={errors.name ? ("custom-input custom-input--error") : ("custom-input")}>
            <input className='custom-input__field' {...register('name')} type="text" placeholder='Имя' />
            <UserIcon className='custom-input__icon' width={24} height={24} aria-hidden={true} />
          </div>
          {errors.name && <span className="custom-input__error">{errors.name.message}</span>}
        </div>

        <div className='auth-form__field'>
          <div className={errors.surname ? ("custom-input custom-input--error") : ("custom-input")}>
            <input className='custom-input__field' {...register('surname')} type="text" placeholder='Фамилия' />
            <UserIcon className='custom-input__icon' width={24} height={24} aria-hidden={true} />
          </div>
          {errors.surname && <span className="custom-input__error">{errors.surname.message}</span>}
        </div>

        <div className='auth-form__field'>
          <div className={errors.password ? ("custom-input custom-input--error") : ("custom-input")}>
            <input className='custom-input__field' {...register('password')} type="password" placeholder='Пароль' />
            <PasswordIcon className='custom-input__icon' width={24} height={24} aria-hidden={true} />
          </div>
          {errors.password && <span className="custom-input__error">{errors.password.message}</span>}
        </div>

        <div className='auth-form__field auth-form__field--last'>
          <div className={errors.confirmPassword ? ("custom-input custom-input--error") : ("custom-input")}>
            <input
              className='custom-input__field'
              {...register('confirmPassword')}
              type="password"
              placeholder='Подтвердить пароль'
            />
            <PasswordIcon className='custom-input__icon' width={24} height={24} aria-hidden={true} />
          </div>
          {errors.confirmPassword && <span className="custom-input__error">{errors.confirmPassword.message}</span>}
        </div>

        {error && (
          <span className="auth-form__error">
            {error}
          </span>
        )}

        <button type="submit" className="btn btn--primary auth-form__submit">
          {isLoading ? 'Создаём...' : 'Создать аккаунт'}
        </button>
      </form>
      <button
        type="button"
        className="modal__link"
        onClick={() => switchMode('login')}
      >
        <span>
          У меня есть пароль
        </span>
      </button>
    </>
  );
};