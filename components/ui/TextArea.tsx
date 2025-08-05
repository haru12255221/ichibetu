'use client';

import { forwardRef, useId } from 'react';

interface TextAreaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  id?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  label,
  id,
  rows = 4,
  maxLength,
  showCharCount = false,
}, ref) => {
  const generatedId = useId();
  const textAreaId = id || generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  const charCount = value.length;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  return (
    <div className={`w-full ${className}`}>
      {/* ラベル */}
      {label && (
        <label 
          htmlFor={textAreaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* テキストエリア */}
      <textarea
        ref={ref}
        id={textAreaId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-3 py-2 
          border rounded-lg
          text-gray-900 placeholder-gray-500
          transition-colors duration-200
          resize-vertical
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error || isOverLimit
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      />
      
      {/* 文字数カウント */}
      {(showCharCount || maxLength) && (
        <div className="mt-1 flex justify-between items-center">
          <div className="flex-1">
            {/* エラーメッセージ */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          {/* 文字数表示 */}
          <p className={`text-sm ${
            isOverLimit ? 'text-red-600' : 'text-gray-500'
          }`}>
            {charCount}{maxLength && `/${maxLength}`}
          </p>
        </div>
      )}
      
      {/* エラーメッセージ（文字数カウントがない場合） */}
      {error && !showCharCount && !maxLength && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;