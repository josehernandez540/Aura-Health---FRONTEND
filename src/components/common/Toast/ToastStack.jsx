import React from 'react';
import { useUIStore } from '../../../store/ui.store';
import Toast from './Toast';
import './toastStack.css';

const ToastStack = () => {
  const { toasts, closeToast } = useUIStore();

  return (
    <div className="toast-stack-container">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="toast-stack-item"
          style={{
            '--index': index,
            '--total': toasts.length,
            zIndex: 1000 - index,
            transform: `translateY(${index * 12}px) scale(${1 - index * 0.05})`,
            opacity: index === 0 ? 1 : 0.7,
            filter: index === 0 ? 'none' : 'blur(1px)'
          }}
        >
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => closeToast(toast.id)} 
          />
        </div>
      ))}
    </div>
  );
};

export default ToastStack;