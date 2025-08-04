# コーディングガイドライン

## 基本原則

### 1. 最小限の実装
- **MINIMAL**な実装を心がける
- 要件に直接関係しない機能は追加しない
- シンプルで理解しやすいコードを書く

### 2. 段階的開発
- 一度に多くの機能を実装しない
- 各タスクは独立して完了できるようにする
- テスト可能な単位で実装を進める

### 3. 型安全性の確保
- TypeScriptの型システムを最大限活用
- `any` 型の使用は避ける
- 適切なインターフェースと型定義を作成

## Next.js App Router 固有のガイドライン

### ファイル構造
```
src/app/
├── layout.tsx          # ルートレイアウト
├── page.tsx           # ホームページ
├── api/               # API Routes
│   ├── restaurants/   # 店舗関連API
│   ├── favorites/     # お気に入り関連API
│   └── auth/          # 認証関連API
└── [feature]/         # 機能別ページ

components/
├── ui/                # 再利用可能なUIコンポーネント
└── providers/         # Context Providers

lib/
├── prisma.ts          # Prismaクライアント
├── auth.ts            # 認証設定
└── navigation.ts      # ナビゲーション定義
```

### API Routes の実装パターン
```typescript
// 統一されたレスポンス形式
return NextResponse.json({
  success: true,
  data: result,
  message: "操作が完了しました"
})

// エラーハンドリング
return NextResponse.json(
  { 
    success: false,
    error: {
      code: 'ERROR_CODE',
      message: 'エラーメッセージ'
    }
  },
  { status: 400 }
)
```

## Prisma使用ガイドライン

### クエリの書き方
```typescript
// 必要なフィールドのみ選択
const restaurants = await prisma.restaurant.findMany({
  where: { isActive: true },
  select: {
    id: true,
    name: true,
    mainImageUrl: true,
    ownerMessage: true,
  }
})

// リレーションを含む場合
const favorites = await prisma.favorite.findMany({
  include: {
    restaurant: {
      select: {
        id: true,
        name: true,
        mainImageUrl: true,
      }
    }
  }
})
```

## React/TypeScript コンポーネント

### コンポーネント定義
```typescript
interface ComponentProps {
  title: string;
  isVisible?: boolean;
  onAction?: () => void;
}

export default function Component({ 
  title, 
  isVisible = false, 
  onAction 
}: ComponentProps) {
  // 実装
}
```

### Hooks の使用
```typescript
'use client'; // クライアントコンポーネントの場合

import { useState, useEffect } from 'react';

export function useCustomHook() {
  const [state, setState] = useState<Type>(initialValue);
  
  // ロジック
  
  return { state, setState };
}
```

## CSS/Tailwind の使用方針

### モバイルファースト
```typescript
// レスポンシブデザイン
className="w-full md:w-1/2 lg:w-1/3"

// タッチ操作最適化
className="touch-manipulation select-none"
```

### アニメーション
```typescript
// Framer Motion使用例
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

## エラーハンドリング

### フロントエンド
```typescript
try {
  const response = await fetch('/api/endpoint');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error.message);
  }
  
  return data.data;
} catch (error) {
  console.error('API呼び出しエラー:', error);
  // ユーザーフレンドリーなエラー表示
}
```

### バックエンド
```typescript
export async function POST(request: NextRequest) {
  try {
    // 処理
  } catch (error) {
    console.error('API処理エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
```

## コミット・ドキュメント

### コミットメッセージ
```
feat: 店舗一覧取得API実装
fix: お気に入り削除時のエラー修正
docs: README更新
style: コードフォーマット調整
```

### コメント
```typescript
/**
 * 店舗一覧を取得する
 * @param isActive アクティブな店舗のみ取得するかどうか
 * @returns 店舗一覧
 */
async function getRestaurants(isActive: boolean = true) {
  // 実装
}
```