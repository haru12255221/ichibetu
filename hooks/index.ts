/**
 * 一瞥アプリ - カスタムフック統合エクスポート
 * 和の心でデータを管理する
 */

// 認証関連
export { useAuth } from './useAuth';
export type { User, AuthState } from './useAuth';

// 店舗データ関連
export { 
  useRestaurants, 
  useRestaurant, 
  useCreateRestaurant 
} from './useRestaurants';

// お気に入り関連
export { 
  useFavorites, 
  useAddFavorite, 
  useRemoveFavorite, 
  useFavoriteStatus 
} from './useFavorites';

// エラーハンドリング関連
export { 
  useErrorHandler, 
  useAsyncError 
} from './useErrorHandler';

// API関連の型
export type { 
  Restaurant, 
  Favorite, 
  ApiResponse, 
  ApiError 
} from '../lib/api';