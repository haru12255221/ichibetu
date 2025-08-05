'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  type = 'button',
  className = '',
}: ButtonProps) {
  // バリエーション別のスタイル - 和のテイスト
  const variantStyles = {
    primary: 'bg-primary text-on-primary hover:bg-primary-light active:bg-primary-dark shadow-sm hover:shadow-md border border-primary/20',
    secondary: 'bg-secondary text-on-secondary hover:bg-secondary-light active:bg-secondary-dark shadow-sm hover:shadow-md border border-secondary/20',
    danger: 'bg-danger text-on-primary hover:opacity-90 active:opacity-80 shadow-sm hover:shadow-md border border-danger/20',
    ghost: 'bg-transparent text-primary hover:bg-surface active:bg-border-light border border-border',
  };

  // サイズ別のスタイル
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // アイコンサイズ
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-md
        transition-all duration-300
        touch-manipulation
        select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02]'
        }
        ${className}
      `}
    >
      {/* ローディングスピナー */}
      {loading && (
        <div className={`${iconSizes[size]} mr-2 border-2 border-current border-t-transparent rounded-full animate-spin`} />
      )}
      
      {/* アイコン */}
      {icon && !loading && (
        <span className={`${iconSizes[size]} mr-2`}>
          {icon}
        </span>
      )}
      
      {/* テキスト */}
      <span>{children}</span>
    </button>
  );
}