'use client';

import { ReactNode } from 'react';
import Navigation from './Navigation';

interface PageLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showBack?: boolean;
  showFavorite?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  title?: string;
  className?: string;
}

export default function PageLayout({
  children,
  showNavigation = false,
  showBack = false,
  showFavorite = false,
  isFavorited = false,
  onFavoriteToggle,
  title,
  className = '',
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {showNavigation && (
        <Navigation
          showBack={showBack}
          showFavorite={showFavorite}
          isFavorited={isFavorited}
          onFavoriteToggle={onFavoriteToggle}
          title={title}
        />
      )}
      <div className={showNavigation ? 'pt-16' : ''}>
        {children}
      </div>
    </div>
  );
}