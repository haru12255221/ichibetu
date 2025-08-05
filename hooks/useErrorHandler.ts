'use client';

import { useState, useCallback } from 'react';
import { ApiError } from '../lib/api';

/**
 * エラーハンドリングフック
 * 一瞥アプリの静かなエラー処理
 */
export function useErrorHandler() {
  const [error, setError] = useState<ApiError | null>(null);
  const [isShowingError, setIsShowingError] = useState(false);

  const handleError = useCallback((error: unknown) => {
    console.error('一瞥アプリエラー:', error);
    
    if (error instanceof ApiError) {
      setError(error);
    } else if (error instanceof Error) {
      setError(new ApiError(error.message, 500));
    } else {
      setError(new ApiError('予期しないエラーが発生しました', 500));
    }
    
    setIsShowingError(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsShowingError(false);
  }, []);

  const getErrorMessage = useCallback((error: ApiError | null): string => {
    if (!error) return '';
    
    // エラーコードに応じた和風メッセージ
    switch (error.code) {
      case 'RESTAURANT_NOT_FOUND':
        return 'お探しの店舗が見つかりませんでした';
      case 'DUPLICATE_FAVORITE':
        return 'すでにお気に入りに追加されています';
      case 'VALIDATION_FAILED':
        return '入力内容をご確認ください';
      case 'NETWORK_ERROR':
        return 'ネットワークに接続できません';
      default:
        return error.message || '申し訳ございません。エラーが発生しました';
    }
  }, []);

  return {
    error,
    isShowingError,
    handleError,
    clearError,
    getErrorMessage,
  };
}

/**
 * 非同期処理用のエラーハンドリングフック
 * Promise処理の和風エラーハンドリング
 */
export function useAsyncError() {
  const { handleError } = useErrorHandler();
  
  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: ApiError) => void
  ): Promise<T | null> => {
    try {
      const result = await asyncFn();
      onSuccess?.(result);
      return result;
    } catch (error) {
      const apiError = error instanceof ApiError 
        ? error 
        : new ApiError('処理中にエラーが発生しました', 500);
      
      handleError(apiError);
      onError?.(apiError);
      return null;
    }
  }, [handleError]);

  return {
    executeAsync,
  };
}