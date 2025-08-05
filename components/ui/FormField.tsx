'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  children: ReactNode;
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  description?: string;
}

export default function FormField({
  children,
  label,
  error,
  required = false,
  className = '',
  description,
}: FormFieldProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* ラベル */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* 説明文 */}
      {description && (
        <p className="text-sm text-gray-600 mb-2">
          {description}
        </p>
      )}
      
      {/* フォーム要素 */}
      <div className="relative">
        {children}
      </div>
      
      {/* エラーメッセージ */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg 
            className="w-4 h-4 mr-1 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}