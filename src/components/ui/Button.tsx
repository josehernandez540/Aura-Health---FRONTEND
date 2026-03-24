import React from 'react';

const Button = ({ children, isLoading, variant = 'primary', ...props }) => {
    
  const className = variant === 'primary' ? 'login-btn' : 'btn-ghost';
  
  return (
    <button className={className} disabled={isLoading} {...props}>
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};

export default Button;