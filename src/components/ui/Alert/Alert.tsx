import React from 'react';
import './alert.css';

const icons = {
  info: <img src="/icons/info.svg" alt="info" className="alert-icon-img" />,
  success: <img src="/icons/success.svg" alt="success" className="alert-icon-img" />,
  warning: <img src="/icons/warning.svg" alt="warning" className="alert-icon-img" />,
  danger: <img src="/icons/danger.svg" alt="danger" className="alert-icon-img" />,
};

const Alert = ({ children, variant = "info", icon, className = "" }) => {
  const selectedIcon = icon || icons[variant] || icons.info;

  return (
    <div className={`alert alert-${variant} ${className}`}>
      <span className="alert-icon-container">
        {selectedIcon}
      </span>
      <div className="alert-content">
        {children}
      </div>
    </div>
  );
};

export default Alert;