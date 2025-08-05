'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  shadow = 'md',
  padding = 'md',
  onClick,
  hover = false,
}: CardProps) {
  // シャドウのスタイル - 一瞥カラーシステム
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  // パディングのスタイル
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        bg-surface-elevated rounded-lg border border-light
        ${shadowStyles[shadow]}
        ${paddingStyles[padding]}
        ${isClickable 
          ? 'cursor-pointer touch-manipulation select-none' 
          : ''
        }
        ${hover || isClickable 
          ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-accent/30' 
          : 'transition-all duration-200'
        }
        ${isClickable 
          ? 'active:scale-[0.98] active:shadow-md' 
          : ''
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}