'use client';

import useSWR from 'swr';
import { fetcher, mutationFetcher, Restaurant, API_ENDPOINTS, ApiError } from '../lib/api';

/**
 * 店舗一覧取得フック
 * 一瞥の物語を紡ぐ店舗たちを取得
 */
export function useRestaurants() {
  const { data, error, isLoading, mutate } = useSWR<Restaurant[]>(
    API_ENDPOINTS.RESTAURANTS,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1分間は重複リクエストを防ぐ
    }
  );

  return {
    restaurants: data || [],
    isLoading,
    isError: !!error,
    error: error as ApiError,
    mutate,
  };
}

/**
 * 店舗詳細取得フック
 * 特定の店舗の深い物語を取得
 */
export function useRestaurant(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Restaurant>(
    id ? API_ENDPOINTS.RESTAURANT_DETAIL(id) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    restaurant: data,
    isLoading,
    isError: !!error,
    error: error as ApiError,
    mutate,
  };
}

/**
 * 店舗登録フック
 * 新しい物語を一瞥に追加
 */
export function useCreateRestaurant() {
  const createRestaurant = async (restaurantData: {
    name: string;
    address: string;
    hours?: string;
    phone?: string;
    mainImageUrl: string;
    ownerMessage: string;
    story: string;
  }): Promise<Restaurant> => {
    return mutationFetcher<Restaurant>(API_ENDPOINTS.RESTAURANTS, {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    });
  };

  return {
    createRestaurant,
  };
}