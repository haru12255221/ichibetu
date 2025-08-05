'use client';

import useSWR from 'swr';
import { fetcher, mutationFetcher, Favorite, API_ENDPOINTS, ApiError } from '../lib/api';

/**
 * お気に入り一覧取得フック
 * 心に響いた物語のコレクション
 */
export function useFavorites() {
  const { data, error, isLoading, mutate } = useSWR<Favorite[]>(
    API_ENDPOINTS.FAVORITES,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30秒間は重複リクエストを防ぐ
    }
  );

  return {
    favorites: data || [],
    isLoading,
    isError: !!error,
    error: error as ApiError,
    mutate,
  };
}

/**
 * お気に入り追加フック
 * 物語を心のコレクションに追加
 */
export function useAddFavorite() {
  const { mutate } = useSWR(API_ENDPOINTS.FAVORITES);

  const addFavorite = async (restaurantId: string): Promise<Favorite> => {
    const newFavorite = await mutationFetcher<Favorite>(API_ENDPOINTS.FAVORITES, {
      method: 'POST',
      body: JSON.stringify({ restaurantId }),
    });

    // SWRキャッシュを更新
    mutate();

    return newFavorite;
  };

  return {
    addFavorite,
  };
}

/**
 * お気に入り削除フック
 * 心のコレクションから静かに取り除く
 */
export function useRemoveFavorite() {
  const { mutate } = useSWR(API_ENDPOINTS.FAVORITES);

  const removeFavorite = async (favoriteId: string): Promise<void> => {
    await mutationFetcher<void>(API_ENDPOINTS.FAVORITE_DELETE(favoriteId), {
      method: 'DELETE',
    });

    // SWRキャッシュを更新
    mutate();
  };

  return {
    removeFavorite,
  };
}

/**
 * お気に入り状態チェックフック
 * 特定の店舗がお気に入りかどうかを確認
 */
export function useFavoriteStatus(restaurantId: string | null) {
  const { favorites, isLoading } = useFavorites();

  const isFavorited = restaurantId 
    ? favorites.some(fav => fav.restaurantId === restaurantId)
    : false;

  const favoriteItem = restaurantId 
    ? favorites.find(fav => fav.restaurantId === restaurantId)
    : null;

  return {
    isFavorited,
    favoriteItem,
    isLoading,
  };
}