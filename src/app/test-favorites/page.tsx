'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Restaurant {
  id: string
  name: string
  mainImageUrl: string
  ownerMessage: string
}

interface Favorite {
  id: string
  restaurant: {
    id: string
    name: string
    mainImageUrl: string
    ownerMessage: string
    address: string
  }
  createdAt: string
}

export default function TestFavoritesPage() {
  const { data: session, status } = useSession()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // 店舗一覧を取得
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants')
        if (response.ok) {
          const result = await response.json()
          setRestaurants(result.data || [])
        }
      } catch (error) {
        console.error('店舗取得エラー:', error)
      }
    }
    fetchRestaurants()
  }, [])

  // お気に入り一覧を取得
  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const result = await response.json()
        setFavorites(result.favorites || [])
        setMessage(`📋 ${result.message}`)
      } else {
        const errorData = await response.json()
        setMessage(`❌ ${errorData.error}`)
      }
    } catch (error) {
      setMessage('❌ お気に入り取得でネットワークエラーが発生しました')
      console.error('お気に入り取得エラー:', error)
    }
  }

  // お気に入り追加テスト
  const addToFavorites = async (restaurantId: string) => {
    console.log('お気に入り追加開始 - 店舗ID:', restaurantId)
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      })

      const data = await response.json()
      console.log('API レスポンス:', response.status, data)

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
        // お気に入り追加後、一覧を再取得
        await fetchFavorites()
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ ネットワークエラーが発生しました')
      console.error('お気に入り追加エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <div className="p-4">セッション読み込み中...</div>
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">お気に入り機能テスト</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">セッション情報</h2>
        <p>ユーザーID: {session?.user?.id || '未ログイン'}</p>
        <p>ユーザー名: {session?.user?.name || 'なし'}</p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* お気に入り一覧セクション */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">お気に入り一覧</h2>
            <button
              onClick={fetchFavorites}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              一覧を取得
            </button>
          </div>
          
          {favorites.length === 0 ? (
            <p className="text-gray-500">お気に入りはまだありません</p>
          ) : (
            <div className="space-y-3">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="border p-4 rounded-lg bg-yellow-50">
                  <h3 className="font-semibold text-yellow-800">{favorite.restaurant.name}</h3>
                  <p className="text-gray-600 text-sm">{favorite.restaurant.ownerMessage}</p>
                  <p className="text-gray-500 text-xs">{favorite.restaurant.address}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    追加日時: {new Date(favorite.createdAt).toLocaleString('ja-JP')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 店舗一覧セクション */}
        <div>
          <h2 className="text-xl font-semibold">店舗一覧</h2>
          {restaurants.length === 0 ? (
            <p>店舗データがありません</p>
          ) : (
            restaurants.map((restaurant) => (
              <div key={restaurant.id} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{restaurant.ownerMessage}</p>
                <button
                  onClick={() => addToFavorites(restaurant.id)}
                  disabled={loading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? '追加中...' : 'お気に入りに追加'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}