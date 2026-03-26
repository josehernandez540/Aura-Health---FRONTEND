import './button.css';

const Button = ({
  children,
  isLoading,
  variant = "primary",
  type = "button",
  disabled,
  ...rest
}) => {

  return (
    <button
      type={type}
      className={"btn " + "btn-"+variant}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};

export default Button;