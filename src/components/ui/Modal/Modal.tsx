import React, { useEffect } from 'react';
import './modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md',
  className = "" 
}) => {
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className={`modal-overlay ${isOpen ? 'open' : ''}`} 
      onClick={onClose}
    >
      <div 
        className={`modal ${size === 'lg' ? 'modal-lg' : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn">
            &times;
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;