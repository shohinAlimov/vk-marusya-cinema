import { type AuthMode } from '../../types/auth';
import "./SuccessMessage.scss";

type Props = {
  switchMode: (mode: AuthMode) => void;
};

export const SuccessMessage = ({ switchMode }: Props) => {
  return (
    <div className="success-message">
      <h2 className='success-message__title'>Регистрация завершена</h2>
      <p className='success-message__desc'>Используйте вашу электронную почту для входа</p>

      <button
        className="btn btn--primary success-message__btn"
        onClick={() => {
          switchMode('login')
        }}
      >
        Войти
      </button>
    </div>
  );
};
