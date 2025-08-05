'use client';

import { forwardRef, useId } from 'react';

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
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* ラベル */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-primary mb-1"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
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
          border rounded-md
          text-primary placeholder-tertiary
          bg-surface
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
          disabled:bg-border-light disabled:cursor-not-allowed disabled:opacity-60
          ${error 
            ? 'border-danger focus:ring-danger/20 focus:border-danger' 
            : 'border-border hover:border-secondary'
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
        <p className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;