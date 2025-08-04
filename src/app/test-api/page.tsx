'use client'

import { useState, useEffect } from 'react'

interface Restaurant {
  id: string
  name: string
  mainImageUrl: string
  ownerMessage: string
}

interface RestaurantDetail {
  id: string
  name: string
  address: string
  hours: string | null
  phone: string | null
  mainImageUrl: string
  ownerMessage: string
  story: string
  favoriteCount: number
}

export default function TestAPIPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 店舗一覧を取得
  const fetchRestaurants = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/restaurants')
      const data = await response.json()
      
      if (data.success) {
        setRestaurants(data.data)
      } else {
        setError(data.error.message)
      }
    } catch (err) {
      setError('店舗一覧の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 店舗詳細を取得
  const fetchRestaurantDetail = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/restaurants/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedRestaurant(data.data)
      } else {
        setError(data.error.message)
      }
    } catch (err) {
      setError('店舗詳細の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">API テストページ</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          エラー: {error}
        </div>
      )}
      
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* 店舗一覧 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">店舗一覧</h2>
          <button 
            onClick={fetchRestaurants}
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            再読み込み
          </button>
          
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <div 
                key={restaurant.id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => fetchRestaurantDetail(restaurant.id)}
              >
                <h3 className="font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm">{restaurant.ownerMessage}</p>
                <img 
                  src={restaurant.mainImageUrl} 
                  alt={restaurant.name}
                  className="w-full h-32 object-cover mt-2 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 店舗詳細 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">店舗詳細</h2>
          
          {selectedRestaurant ? (
            <div className="border rounded-lg p-4">
              <img 
                src={selectedRestaurant.mainImageUrl} 
                alt={selectedRestaurant.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{selectedRestaurant.name}</h3>
              <p className="text-gray-600 mb-2">{selectedRestaurant.address}</p>
              {selectedRestaurant.hours && (
                <p className="text-gray-600 mb-2">営業時間: {selectedRestaurant.hours}</p>
              )}
              {selectedRestaurant.phone && (
                <p className="text-gray-600 mb-2">電話: {selectedRestaurant.phone}</p>
              )}
              <p className="font-medium mb-2">「{selectedRestaurant.ownerMessage}」</p>
              <p className="text-sm text-gray-700 mb-2">{selectedRestaurant.story}</p>
              <p className="text-sm text-gray-500">お気に入り数: {selectedRestaurant.favoriteCount}</p>
            </div>
          ) : (
            <p className="text-gray-500">店舗を選択してください</p>
          )}
        </div>
      </div>
    </div>
  )
}