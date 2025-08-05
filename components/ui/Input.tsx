'use client';

import { forwardRef } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  id?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  label,
  id,
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {/* ラベル */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* 入力フィールド */}
      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 
          border rounded-lg
          text-gray-900 placeholder-gray-500
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        // モバイルキーボード最適化
        inputMode={
          type === 'email' ? 'email' :
          type === 'tel' ? 'tel' :
          type === 'url' ? 'url' :
          'text'
        }
        autoComplete={
          type === 'email' ? 'email' :
          type === 'tel' ? 'tel' :
          type === 'url' ? 'url' :
          'off'
        }
      />
      
      {/* エラーメッセージ */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;