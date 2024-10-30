import React from "react";

const Button = ({
  onClick,
  icon = null,
  text = "",
  size = "medium", // small | medium | large
  backgroundColor = "#4F46E5",
  textColor = "#FFFFFF",
  className = "",
  disabled = false,
}) => {
  const sizeStyles = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-lg shadow-md 
        ${sizeStyles[size]} ${className} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
      `}
      style={{
        backgroundColor: icon ? "transparent" : backgroundColor,
        color: icon ? "inherit" : textColor,
      }}
    >
      {icon && (
        <span className="mr-2 flex items-center justify-center text-lg">
          {icon}
        </span>
      )}
      {text && <span>{text}</span>}
    </button>
  );
};

export default Button;
