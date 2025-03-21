// src/components/UI/Button.jsx
import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  // Determine button classes based on variant and size
  const getButtonClasses = () => {
    const variantClass = styles[variant] || styles.primary;
    const sizeClass = styles[size] || styles.medium;
    
    return `${styles.button} ${variantClass} ${sizeClass} ${className} ${disabled ? styles.disabled : ''}`;
};

return (
  <button
    type={type}
    className={getButtonClasses()}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);
};

export default Button;