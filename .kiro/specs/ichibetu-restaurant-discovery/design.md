# 『一瞥』設計書（MVP版）

## 概要

『一瞥』は、地元飲食店の「物語」とユーザーの「感性」を直感的に結びつけるモバイルファーストのWebアプリケーションです。カードスワイプによる没入感のある店舗発見体験を提供し、評価経済を排除した新しい形の店舗PRプラットフォームを実現します。

## アーキテクチャ

### システム全体構成

```mermaid
graph TB
    subgraph "Next.js アプリケーション"
        A[React Components]
        B[App Router]
        C[API Routes]
        D[Middleware]
    end
    
    subgraph "Vercel プラットフォーム"
        E[Edge Functions]
        F[Image Optimization]
        G[Blob Storage]
    end
    
    subgraph "データ層"
        H[PlanetScale MySQL]
        I[Prisma ORM]
    end
    
    A --> B
    B --> C
    C --> I
    I --> H
    C --> G
    F --> G
    E --> C
```

### 技術スタック選定

#### フルスタックフレームワーク
- **Next.js 13** + **TypeScript**: App Routerによるモダンな開発体験
- **Framer Motion**: 滑らかなスワイプアニメーション
- **Tailwind CSS**: 迅速なスタイリング
- **next-pwa**: PWA対応

#### データベース・ORM
- **PlanetScale**: MySQL互換のサーバーレスデータベース
- **Prisma**: 型安全なORM
- **NextAuth.js**: 認証システム（セッションベース）

#### インフラ・ストレージ
- **Vercel**: フロントエンド・バックエンド統合デプロイ
- **Vercel Blob Storage**: 画像ストレージ
- **Vercel Edge Functions**: 高速API実行

## コンポーネントとインターフェース

### フロントエンド画面構成

#### 1. メインスワイプ画面（/）
```
┌─────────────────────────┐
│                         │
│    [渾身の一枚の写真]    │
│                         │
│                         │
│                         │
│                         │
│     「店主の一言」       │
│                         │
│                         │
└─────────────────────────┘

4方向スワイプ操作:
← 左: 次のお店へ
→ 右: お気に入りに追加  
↑ 上: ストーリー詳細へ
↓ 下: お気に入りリストへ
```

**主要機能**:
- 全画面画像表示
- オーバーレイテキスト
- 4方向スワイプジェスチャー認識
- 滑らかなカード遷移アニメーション
- 直感的なナビゲーション（下スワイプでお気に入り）

#### 2. ストーリー詳細画面（/story/:id）
```
┌─────────────────────────┐
│ [←戻る]        [♡追加] │
├─────────────────────────┤
│                         │
│    [メイン写真]         │
│                         │
├─────────────────────────┤
│ 店名: ○○○               │
│ 住所: ○○○               │
│ 営業時間: ○○○           │
├─────────────────────────┤
│                         │
│    店主の物語           │
│    （300-500文字）      │
│                         │
│                         │
└─────────────────────────┘
```

#### 3. お気に入りリスト画面（/favorites）
```
┌─────────────────────────┐
│ [↑戻る]   お気に入り    │
├─────────────────────────┤
│ ┌─────┐ 店名1           │
│ │写真 │ 一言...         │
│ └─────┘                 │
├─────────────────────────┤
│ ┌─────┐ 店名2           │
│ │写真 │ 一言...         │
│ └─────┘                 │
└─────────────────────────┘

アクセス方法:
- メイン画面から下スワイプ
- 上スワイプまたは戻るボタンでメイン画面に戻る
```

#### 4. 店舗登録画面（/register）
```
┌─────────────────────────┐
│      店舗登録           │
├─────────────────────────┤
│ [写真アップロード]      │
├─────────────────────────┤
│ 店主の一言:             │
│ [テキスト入力]          │
├─────────────────────────┤
│ 店舗の物語:             │
│ [テキストエリア]        │
├─────────────────────────┤
│ 基本情報:               │
│ 店名: [入力]            │
│ 住所: [入力]            │
│ 営業時間: [入力]        │
│ 電話番号: [入力]        │
├─────────────────────────┤
│        [登録]           │
└─────────────────────────┘
```

### APIエンドポイント設計

#### 店舗関連API（Next.js API Routes）
```typescript
// app/api/restaurants/route.ts
export async function GET() {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    select: {
      id: true,
      mainImageUrl: true,
      ownerMessage: true,
      name: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return Response.json(restaurants)
}

// app/api/restaurants/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id }
  })
  return Response.json(restaurant)
}

// app/api/restaurants/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const imageFile = formData.get('image') as File
  
  // Vercel Blob Storageに画像アップロード
  const blob = await put(imageFile.name, imageFile, {
    access: 'public',
  })
  
  const restaurant = await prisma.restaurant.create({
    data: {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      hours: formData.get('hours') as string,
      phone: formData.get('phone') as string,
      mainImageUrl: blob.url,
      ownerMessage: formData.get('ownerMessage') as string,
      story: formData.get('story') as string
    }
  })
  
  return Response.json(restaurant)
}
```

#### お気に入り関連API（Next.js API Routes）
```typescript
// app/api/favorites/route.ts
export async function POST(request: Request) {
  const { restaurantId } = await request.json()
  const session = await getServerSession(authOptions)
  
  const favorite = await prisma.favorite.create({
    data: {
      userId: session.user.id,
      restaurantId
    }
  })
  
  return Response.json(favorite)
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          mainImageUrl: true,
          ownerMessage: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return Response.json(favorites)
}

// app/api/favorites/[id]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  await prisma.favorite.delete({
    where: {
      id: params.id,
      userId: session.user.id // 自分のお気に入りのみ削除可能
    }
  })
  
  return Response.json({ success: true })
}
```

## データモデル

### Prismaスキーマ

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

model Restaurant {
  id           String   @id @default(cuid())
  name         String   @db.VarChar(100)
  address      String   @db.Text
  hours        String?  @db.VarChar(200)
  phone        String?  @db.VarChar(20)
  mainImageUrl String   @db.Text
  ownerMessage String   @db.VarChar(200)
  story        String   @db.Text
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  favorites Favorite[]

  @@index([isActive])
  @@map("restaurants")
}

model User {
  id        String   @id @default(cuid())
  sessionId String   @unique @db.VarChar(255)
  createdAt DateTime @default(now())

  favorites Favorite[]

  @@map("users")
}

model Favorite {
  id           String   @id @default(cuid())
  userId       String
  restaurantId String
  createdAt    DateTime @default(now())

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)

  @@unique([userId, restaurantId])
  @@index([userId])
  @@index([createdAt])
  @@map("favorites")
}
```

### TypeScript型定義

```typescript
// 基本型定義
export interface Restaurant {
  id: string
  name: string
  address: string
  hours: string
  phone: string
  mainImageUrl: string
  ownerMessage: string
  story: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  sessionId: string
  createdAt: Date
}

export interface Favorite {
  id: string
  userId: string
  restaurantId: string
  restaurant?: Restaurant
  createdAt: Date
}

// API レスポンス型
export interface RestaurantCard {
  id: string
  mainImageUrl: string
  ownerMessage: string
  name: string
}

export interface RestaurantDetail extends Restaurant {}

export interface FavoriteWithRestaurant {
  id: string
  restaurant: RestaurantCard
  createdAt: Date
}
```

## エラーハンドリング

### フロントエンドエラー処理

```typescript
// エラー境界コンポーネント
class ErrorBoundary extends React.Component {
  // 画像読み込みエラー
  // ネットワークエラー
  // スワイプ操作エラー
}

// エラー種別
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  IMAGE_LOAD_ERROR = 'IMAGE_LOAD_ERROR',
  SWIPE_ERROR = 'SWIPE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}
```

### バックエンドエラー処理

```typescript
// 統一エラーレスポンス
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
}

// エラーコード定義
enum ErrorCode {
  RESTAURANT_NOT_FOUND = 'RESTAURANT_NOT_FOUND',
  INVALID_IMAGE_FORMAT = 'INVALID_IMAGE_FORMAT',
  DUPLICATE_FAVORITE = 'DUPLICATE_FAVORITE',
  VALIDATION_FAILED = 'VALIDATION_FAILED'
}
```

## テスト戦略

### フロントエンドテスト

1. **ユニットテスト**（Jest + React Testing Library）
   - コンポーネントの描画テスト
   - スワイプジェスチャーのテスト
   - 状態管理のテスト

2. **統合テスト**（Cypress）
   - ユーザーフロー全体のテスト
   - スワイプ→詳細→お気に入り追加の流れ

### バックエンドテスト

1. **ユニットテスト**（Jest）
   - API エンドポイントのテスト
   - データベース操作のテスト

2. **統合テスト**
   - API とデータベースの連携テスト

### テストケース例

```typescript
// スワイプ機能のテスト
describe('SwipeCard Component', () => {
  test('右スワイプでお気に入りに追加される', async () => {
    // テスト実装
  })
  
  test('左スワイプで次のカードが表示される', async () => {
    // テスト実装
  })
  
  test('上スワイプで詳細画面に遷移する', async () => {
    // テスト実装
  })
})
```

## パフォーマンス最適化

### 画像最適化戦略

1. **画像圧縮**: WebP形式での配信
2. **レスポンシブ画像**: デバイスサイズに応じた最適化
3. **遅延読み込み**: 次のカードの事前読み込み
4. **CDN活用**: AWS CloudFront での配信

### フロントエンド最適化

```typescript
// 4方向スワイプジェスチャーの実装
const SwipeCard = React.memo(({ restaurant, onSwipe }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(event, info) => {
        const { offset, velocity } = info
        const swipeThreshold = 100
        const velocityThreshold = 500
        
        // 4方向のスワイプ判定
        if (Math.abs(offset.x) > Math.abs(offset.y)) {
          // 水平方向のスワイプ
          if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
            onSwipe('right') // お気に入りに追加
          } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
            onSwipe('left')  // 次のお店へ
          }
        } else {
          // 垂直方向のスワイプ
          if (offset.y < -swipeThreshold || velocity.y < -velocityThreshold) {
            onSwipe('up')    // ストーリー詳細へ
          } else if (offset.y > swipeThreshold || velocity.y > velocityThreshold) {
            onSwipe('down')  // お気に入りリストへ
          }
        }
      }}
    >
      <img src={restaurant.mainImageUrl} alt={restaurant.name} />
      <div className="overlay">
        <p>{restaurant.ownerMessage}</p>
      </div>
    </motion.div>
  )
})

// 画像の事前読み込み
const preloadNextImages = (restaurants: Restaurant[], currentIndex: number) => {
  const nextImages = restaurants.slice(currentIndex + 1, currentIndex + 4)
  nextImages.forEach(restaurant => {
    const img = new Image()
    img.src = restaurant.mainImageUrl
  })
}
```

### バックエンド最適化

1. **データベースクエリ最適化**: 適切なインデックス設定
2. **キャッシュ戦略**: Redis による頻繁なクエリのキャッシュ
3. **画像処理の非同期化**: アップロード時の最適化処理

## セキュリティ考慮事項

### 認証・認可

```typescript
// シンプルなセッション認証
interface SessionData {
  userId: string
  createdAt: Date
  expiresAt: Date
}

// CSRF対策
app.use(csrf({
  cookie: true,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
}))
```

### データ保護

1. **入力値検証**: Joi/Yup による厳密なバリデーション
2. **SQLインジェクション対策**: Prisma ORM の使用
3. **XSS対策**: DOMPurify による入力値サニタイズ
4. **画像アップロード制限**: ファイルサイズ・形式の制限

### プライバシー保護

1. **匿名ユーザー**: 個人情報の最小限収集
2. **データ暗号化**: 機密データの暗号化保存
3. **ログ管理**: 個人情報を含まないログ設計

## デプロイメント戦略

### 開発環境

```bash
# Next.js プロジェクト作成
npx create-next-app@latest ichibetu --typescript --tailwind --eslint --app

# 必要なパッケージインストール
npm install prisma @prisma/client next-auth framer-motion @vercel/blob

# Prisma初期化
npx prisma init

# 開発サーバー起動
npm run dev
```

### 環境変数設定

```bash
# .env.local
DATABASE_URL="mysql://username:password@host:port/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 本番環境

1. **統合プラットフォーム**: Vercel（フロントエンド + API Routes）
2. **データベース**: PlanetScale（MySQL互換）
3. **画像ストレージ**: Vercel Blob Storage
4. **認証**: NextAuth.js（セッションベース）

### CI/CD パイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm test
          npm run test:e2e
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # デプロイスクリプト
```

## 監視・分析

### パフォーマンス監視

1. **Core Web Vitals**: LCP, FID, CLS の監視
2. **エラー追跡**: Sentry による例外監視
3. **アクセス解析**: Google Analytics（プライバシー配慮）

### ビジネス指標

1. **スワイプ率**: 右スワイプ/左スワイプの比率
2. **詳細閲覧率**: 上スワイプの頻度
3. **お気に入り継続率**: お気に入り後の行動追跡

この設計書は、『一瞥』のMVP版を効率的に開発するための技術的基盤を提供します。シンプルでありながら拡張性を考慮した設計により、将来の機能追加にも対応できる構成となっています。