'use client';

import { ReactNode, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  // サイズ別のスタイル
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4',
  };

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-primary bg-opacity-40 transition-opacity backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      {/* モーダルコンテンツ */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative w-full ${sizeStyles[size]}
            bg-surface-elevated rounded-lg shadow-xl border border-border-light
            transform transition-all duration-300
            ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        >
          {/* ヘッダー */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-border">
              {title && (
                <h3 className="text-lg font-semibold text-primary">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-surface transition-all duration-300 hover:shadow-sm"
                  aria-label="閉じる"
                >
                  <XMarkIcon className="w-5 h-5 text-secondary" />
                </button>
              )}
            </div>
          )}
          
          {/* コンテンツ */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}