'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function useAuth() {
  // 開発段階では固定の匿名ユーザーを返す
  const [userId] = useState(() => `dev_user_${Date.now()}`)
  
  return {
    user: { id: userId, name: "開発用ユーザー" },
    userId: userId,
    sessionId: userId,
    isLoading: false,
    isAuthenticated: true,
  }
  
  // 後で認証機能を有効化する場合は以下のコメントアウトを解除
  /*
  const { data: session, status } = useSession()
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    if (status !== "loading") {
      setIsReady(true)
    }
  }, [status])
  
  return {
    user: session?.user,
    userId: session?.user?.id,
    sessionId: (session?.user as any)?.sessionId,
    isLoading: status === "loading" || !isReady,
    isAuthenticated: !!session?.user,
  }
  */
}

// お気に入り管理用のフック
export function useFavorites() {
  const { userId, isLoading } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false)
  
  const addFavorite = async (restaurantId: string) => {
    if (!userId) return
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      })
      
      if (response.ok) {
        // お気に入りリストを更新
        fetchFavorites()
      }
    } catch (error) {
      console.error('お気に入り追加エラー:', error)
    }
  }
  
  const removeFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        // お気に入りリストを更新
        fetchFavorites()
      }
    } catch (error) {
      console.error('お気に入り削除エラー:', error)
    }
  }
  
  const fetchFavorites = async () => {
    if (!userId || isLoading) return
    
    setIsLoadingFavorites(true)
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error('お気に入り取得エラー:', error)
    } finally {
      setIsLoadingFavorites(false)
    }
  }
  
  useEffect(() => {
    fetchFavorites()
  }, [userId, isLoading])
  
  return {
    favorites,
    isLoadingFavorites,
    addFavorite,
    removeFavorite,
    refetch: fetchFavorites,
  }
}