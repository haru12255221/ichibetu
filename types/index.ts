// 基本型定義
export interface Restaurant {
  id: string
  name: string
  address: string
  hours: string | null
  phone: string | null
  mainImageUrl: string
  ownerMessage: string
  story: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  sessionId: string
  createdAt: Date
}

export interface Favorite {
  id: string
  userId: string
  restaurantId: string
  restaurant?: Restaurant
  createdAt: Date
}

// API レスポンス型
export interface RestaurantCard {
  id: string
  mainImageUrl: string
  ownerMessage: string
  name: string
}

export interface RestaurantDetail extends Restaurant {}

export interface FavoriteWithRestaurant {
  id: string
  restaurant: RestaurantCard
  createdAt: Date
}

// スワイプ方向の型定義
export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

// エラー型定義
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  IMAGE_LOAD_ERROR = 'IMAGE_LOAD_ERROR',
  SWIPE_ERROR = 'SWIPE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
}

export enum ErrorCode {
  RESTAURANT_NOT_FOUND = 'RESTAURANT_NOT_FOUND',
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  DUPLICATE_FAVORITE = 'DUPLICATE_FAVORITE',
  VALIDATION_FAILED = 'VALIDATION_FAILED'
}