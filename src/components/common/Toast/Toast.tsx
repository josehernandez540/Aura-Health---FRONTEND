import React from 'react';
import './toast.css';
import type { ToastType } from '../../../store/ui.store';

  const icons: Record<ToastType, React.ReactNode> = {
  info: <img src="/icons/info.svg" alt="info" className="toast-icon-img" />,
  success: <img src="/icons/success.svg" alt="success" className="toast-icon-img" />,
  warning: <img src="/icons/warning.svg" alt="warning" className="toast-icon-img" />,
  danger: <img src="/icons/danger.svg" alt="danger" className="toast-icon-img" />,
};

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  const selectedIcon = icons[type] || icons.info;

  return (
    <div className={`toast-wrapper toast-${type}`}>
      <div className="toast-side-border"></div>
      
      <div className="toast-icon-container">
        {selectedIcon}
      </div>

      <div className="toast-body">
        <p className="toast-message">{message}</p>
      </div>

      <button className="toast-close" onClick={onClose} aria-label="Cerrar">
        <img src="/icons/close.svg" alt="close" />
      </button>

      <div className="toast-timer-bar"></div>
    </div>
  );
};

export default Toast;