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
  // バリエーション別のスタイル
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
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
        font-medium rounded-lg
        transition-all duration-200
        touch-manipulation
        select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer transform active:scale-95'
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