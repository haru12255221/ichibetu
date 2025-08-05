'use client';

import { useState } from 'react';
import { 
  useRestaurants, 
  useRestaurant, 
  useFavorites, 
  useAddFavorite, 
  useRemoveFavorite,
  useFavoriteStatus,
  useAuth,
  useErrorHandler
} from '../../../hooks';
import { 
  Button, 
  Card, 
  Loading, 
  PageLayout,
  OptimizedImage 
} from '../../../components/ui';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function TestDataPage() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  
  // データフェッチングフック
  const { restaurants, isLoading: isLoadingRestaurants, isError: isRestaurantsError } = useRestaurants();
  const { restaurant, isLoading: isLoadingRestaurant } = useRestaurant(selectedRestaurantId);
  const { favorites, isLoading: isLoadingFavorites } = useFavorites();
  const { addFavorite } = useAddFavorite();
  const { removeFavorite } = useRemoveFavorite();
  const { isFavorited, favoriteItem } = useFavoriteStatus(selectedRestaurantId);
  const { user } = useAuth();
  const { error, isShowingError, clearError, getErrorMessage } = useErrorHandler();

  const handleFavoriteToggle = async (restaurantId: string) => {
    try {
      const status = favorites.find(fav => fav.restaurantId === restaurantId);
      
      if (status) {
        await removeFavorite(status.id);
      } else {
        await addFavorite(restaurantId);
      }
    } catch (error) {
      console.error('お気に入り操作エラー:', error);
    }
  };

  return (
    <PageLayout 
      showNavigation 
      showBack 
      title="データフェッチングテスト"
      className="bg-surface"
    >
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* エラー表示 */}
        {isShowingError && error && (
          <Card className="border-danger bg-danger-light">
            <div className="flex items-center justify-between">
              <p className="text-danger font-medium">
                {getErrorMessage(error)}
              </p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                閉じる
              </Button>
            </div>
          </Card>
        )}

        {/* ユーザー情報 */}
        <Card shadow="lg" padding="lg">
          <h2 className="text-heading mb-4 text-primary">認証状態</h2>
          <div className="space-y-2">
            <p className="text-body">ユーザー名: <span className="text-primary font-medium">{user?.name}</span></p>
            <p className="text-body">ユーザーID: <span className="text-secondary font-mono text-sm">{user?.id}</span></p>
            <p className="text-body">セッションID: <span className="text-secondary font-mono text-sm">{user?.sessionId}</span></p>
          </div>
        </Card>

        {/* 店舗一覧 */}
        <Card shadow="lg" padding="lg">
          <h2 className="text-heading mb-4 text-primary">店舗一覧</h2>
          
          {isLoadingRestaurants && (
            <Loading size="md" text="店舗情報を取得中..." />
          )}
          
          {isRestaurantsError && (
            <p className="text-danger">店舗情報の取得に失敗しました</p>
          )}
          
          {!isLoadingRestaurants && restaurants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map((restaurant) => {
                const isFav = favorites.some(fav => fav.restaurantId === restaurant.id);
                
                return (
                  <Card 
                    key={restaurant.id} 
                    shadow="md" 
                    padding="md" 
                    hover
                    onClick={() => setSelectedRestaurantId(restaurant.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <OptimizedImage
                        src={restaurant.mainImageUrl}
                        alt={restaurant.name}
                        width={80}
                        height={80}
                        className="rounded-md flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-body font-medium text-primary truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-caption text-secondary mt-1 line-clamp-2">
                          {restaurant.ownerMessage}
                        </p>
                        <p className="text-small text-tertiary mt-2">
                          {restaurant.address}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(restaurant.id);
                        }}
                        className="p-2 rounded-md hover:bg-surface transition-colors"
                      >
                        {isFav ? (
                          <HeartSolidIcon className="w-5 h-5 text-danger" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-secondary" />
                        )}
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>

        {/* 選択された店舗の詳細 */}
        {selectedRestaurantId && (
          <Card shadow="lg" padding="lg">
            <h2 className="text-heading mb-4 text-primary">店舗詳細</h2>
            
            {isLoadingRestaurant && (
              <Loading size="md" text="詳細情報を取得中..." />
            )}
            
            {restaurant && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-subheading text-primary">{restaurant.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-caption text-tertiary">
                      {isFavorited ? 'お気に入り済み' : 'お気に入り未登録'}
                    </span>
                    {isFavorited ? (
                      <HeartSolidIcon className="w-5 h-5 text-danger" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                </div>
                
                <OptimizedImage
                  src={restaurant.mainImageUrl}
                  alt={restaurant.name}
                  width={400}
                  height={300}
                  className="rounded-lg w-full max-w-md"
                />
                
                <div className="space-y-2">
                  <p className="text-body"><strong>店主の一言:</strong> {restaurant.ownerMessage}</p>
                  <p className="text-body"><strong>住所:</strong> {restaurant.address}</p>
                  {restaurant.hours && (
                    <p className="text-body"><strong>営業時間:</strong> {restaurant.hours}</p>
                  )}
                  {restaurant.phone && (
                    <p className="text-body"><strong>電話:</strong> {restaurant.phone}</p>
                  )}
                </div>
                
                <div className="bg-surface p-4 rounded-lg">
                  <h4 className="text-body font-medium text-primary mb-2">店舗の物語</h4>
                  <p className="text-body text-secondary leading-relaxed">
                    {restaurant.story}
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* お気に入り一覧 */}
        <Card shadow="lg" padding="lg">
          <h2 className="text-heading mb-4 text-primary">お気に入り一覧</h2>
          
          {isLoadingFavorites && (
            <Loading size="md" text="お気に入りを取得中..." />
          )}
          
          {!isLoadingFavorites && favorites.length === 0 && (
            <p className="text-secondary text-center py-8">
              まだお気に入りがありません
            </p>
          )}
          
          {!isLoadingFavorites && favorites.length > 0 && (
            <div className="space-y-3">
              {favorites.map((favorite) => (
                <Card 
                  key={favorite.id} 
                  shadow="sm" 
                  padding="sm"
                  className="flex items-center space-x-3"
                >
                  <OptimizedImage
                    src={favorite.restaurant.mainImageUrl}
                    alt={favorite.restaurant.name}
                    width={60}
                    height={60}
                    className="rounded-md flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body font-medium text-primary">
                      {favorite.restaurant.name}
                    </h4>
                    <p className="text-caption text-secondary">
                      {favorite.restaurant.ownerMessage}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(favorite.id)}
                  >
                    削除
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </Card>

      </div>
    </PageLayout>
  );
}