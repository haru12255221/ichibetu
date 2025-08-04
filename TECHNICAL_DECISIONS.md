# 技術的決定事項

## データベース選択

### 開発環境: SQLite
- **選択理由**: 無料、設定不要、ローカル開発に最適
- **設定**: `DATABASE_URL="file:./dev.db"`
- **Prismaスキーマ**: SQLite用に調整済み

### 本番環境候補
1. **Supabase** (PostgreSQL)
   - 無料枠: 500MB、50,000リクエスト/月
   - 特徴: リアルタイム機能、認証機能内蔵

2. **Railway**
   - 無料枠: $5/月のクレジット
   - 特徴: PostgreSQL、MySQL対応

3. **Neon** (PostgreSQL)
   - 無料枠: 512MB、10GB転送/月
   - 特徴: サーバーレスPostgreSQL

## 認証システム

### 開発段階: 固定匿名ユーザー
```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [userId] = useState(() => `dev_user_${Date.now()}`)
  return {
    user: { id: userId, name: "開発用ユーザー" },
    userId: userId,
    isLoading: false,
    isAuthenticated: true,
  }
}
```

### 本番段階: NextAuth.js + JWT
- セッション戦略: JWT
- プロバイダー: 匿名ユーザー対応
- セキュリティ: CSRF対策、セッション暗号化

## 画像ストレージ

### 開発段階: 未実装
- 画像アップロード機能は後回し
- モックデータで開発進行

### 本番段階候補
1. **Cloudinary**
   - 無料枠: 25GB、25,000変換/月
   - 特徴: 画像最適化、リサイズ、CDN

2. **Firebase Storage**
   - 無料枠: 5GB、1GB/日ダウンロード
   - 特徴: Googleアカウントで利用可能

## パッケージ構成

### 現在インストール済み
```json
{
  "dependencies": {
    "@next-auth/prisma-adapter": "^1.0.7",
    "@prisma/client": "^6.13.0",
    "@vercel/blob": "^1.1.1",
    "framer-motion": "^12.23.12",
    "next": "15.4.5",
    "next-auth": "^4.24.11",
    "next-pwa": "^5.6.0",
    "prisma": "^6.13.0",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  }
}
```

### 開発段階で未使用
- `@vercel/blob`: 画像ストレージ（後で実装）
- `@next-auth/prisma-adapter`: 認証（簡素化のため無効化）

## プロジェクト構造

```
ichibetu/
├── src/app/                 # Next.js App Router
│   ├── api/                 # API Routes
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # メインページ
├── components/              # Reactコンポーネント
│   ├── providers/           # プロバイダー
│   ├── ui/                  # UI部品
│   ├── swipe/               # スワイプ機能
│   ├── story/               # 店舗詳細
│   ├── favorites/           # お気に入り
│   └── register/            # 店舗登録
├── hooks/                   # カスタムフック
├── lib/                     # ユーティリティ
├── types/                   # TypeScript型定義
├── prisma/                  # Prismaスキーマ・DB
└── public/                  # 静的ファイル
```

## 開発フロー

1. **API Routes開発**: SQLite + Prismaでバックエンド
2. **UI開発**: 固定ユーザーでフロントエンド
3. **統合テスト**: ローカル環境での動作確認
4. **本番準備**: 認証・ストレージ・DB移行
5. **デプロイ**: Vercel + 選択したサービス

この技術選択により、開発効率を最大化し、後から柔軟に本番環境を構築できる。