'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Restaurant {
  id: string
  name: string
  mainImageUrl: string
  ownerMessage: string
}

export default function TestFavoritesPage() {
  const { data: session, status } = useSession()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
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

  // お気に入り追加テスト
  const addToFavorites = async (restaurantId: string) => {
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

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
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

      <div className="space-y-4">
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
  )
}