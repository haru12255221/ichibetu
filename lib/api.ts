/**
 * 一瞥アプリ - API通信ユーティリティ
 * 和の心でデータを取得する
 */

// API レスポンスの基本型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

// 店舗データ型
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  hours: string | null;
  phone: string | null;
  mainImageUrl: string;
  ownerMessage: string;
  story: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// お気に入りデータ型
export interface Favorite {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: {
    id: string;
    name: string;
    mainImageUrl: string;
    ownerMessage: string;
  };
  createdAt: string;
}

// APIエラー型
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 基本的なfetcher関数
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error?.message || `HTTP ${response.status}`,
      response.status,
      errorData.error?.code
    );
  }
  
  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new ApiError(
      data.error?.message || 'API呼び出しに失敗しました',
      response.status,
      data.error?.code
    );
  }
  
  return data.data as T;
};

// POST/PUT/DELETE用のfetcher
export const mutationFetcher = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error?.message || `HTTP ${response.status}`,
      response.status,
      errorData.error?.code
    );
  }
  
  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new ApiError(
      data.error?.message || 'API呼び出しに失敗しました',
      response.status,
      data.error?.code
    );
  }
  
  return data.data as T;
};

// API エンドポイント定数
export const API_ENDPOINTS = {
  RESTAURANTS: '/api/restaurants',
  RESTAURANT_DETAIL: (id: string) => `/api/restaurants/${id}`,
  FAVORITES: '/api/favorites',
  FAVORITE_DELETE: (id: string) => `/api/favorites/${id}`,
} as const;