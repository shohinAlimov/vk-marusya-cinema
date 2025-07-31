import { type ReactNode } from "react";
import "./Modal.scss";

import CloseIcon from "../../assets/images/icon-close.svg?react";

import { Link } from "react-router-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showLogo?: boolean;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  showLogo = true,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div
        className={`modal__content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close-btn" onClick={onClose}>
          <CloseIcon
            className="modal__close-icon"
            width={24}
            height={24}
            aria-hidden={true}
          />
        </button>
        {showLogo && (
          <Link className="modal__logo-link" to="/">
            VkMarusya
          </Link>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
