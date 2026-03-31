import React from 'react';
import './button.css';

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "info" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};

export default Button;