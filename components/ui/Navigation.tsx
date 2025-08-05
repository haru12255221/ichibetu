'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface NavigationProps {
  showBack?: boolean;
  showFavorite?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  title?: string;
}

export default function Navigation({
  showBack = false,
  showFavorite = false,
  isFavorited = false,
  onFavoriteToggle,
  title,
}: NavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated/90 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* 戻るボタン */}
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-md bg-surface/80 shadow-sm hover:bg-surface-elevated transition-all duration-300 hover:shadow-md"
            aria-label="戻る"
          >
            <ArrowLeftIcon className="w-5 h-5 text-primary" />
          </button>
        )}

        {/* タイトル */}
        {title && (
          <h1 className="text-lg font-semibold text-primary flex-1 text-center">
            {title}
          </h1>
        )}

        {/* お気に入りボタン */}
        {showFavorite && (
          <button
            onClick={onFavoriteToggle}
            className="flex items-center justify-center w-10 h-10 rounded-md bg-surface/80 shadow-sm hover:bg-surface-elevated transition-all duration-300 hover:shadow-md"
            aria-label={isFavorited ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            {isFavorited ? (
              <HeartSolidIcon className="w-5 h-5 text-danger" />
            ) : (
              <HeartIcon className="w-5 h-5 text-primary" />
            )}
          </button>
        )}

        {/* スペーサー（レイアウト調整用） */}
        {!showBack && !showFavorite && <div className="w-10" />}
        {showBack && !showFavorite && <div className="w-10" />}
        {!showBack && showFavorite && <div className="w-10" />}
      </div>
    </nav>
  );
}