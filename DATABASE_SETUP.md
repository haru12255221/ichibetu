# データベース設定手順

## PlanetScale設定

### 1. PlanetScaleアカウント作成
1. https://planetscale.com にアクセス
2. アカウント作成またはログイン
3. 新しいデータベース「ichibetu」を作成

### 2. 接続文字列の取得
1. PlanetScaleダッシュボードで「ichibetu」データベースを選択
2. 「Connect」タブをクリック
3. 「Prisma」を選択
4. 接続文字列をコピー

### 3. 環境変数の設定
`.env.local`ファイルの`DATABASE_URL`を更新：
```
DATABASE_URL="mysql://[username]:[password]@[host].planetscale.com:3306/ichibetu?sslaccept=strict"
```

### 4. スキーマの同期
```bash
# Prismaクライアント生成
npx prisma generate

# スキーマをPlanetScaleにプッシュ
npx prisma db push

# 接続テスト
node scripts/test-db-connection.js
```

## Vercel Blob Storage設定

### 1. Vercelアカウントでブロブストレージを有効化
1. https://vercel.com にアクセス
2. プロジェクトを作成または選択
3. Storage タブでBlob Storageを有効化

### 2. トークンの取得
1. Blob Storage設定でトークンを生成
2. `.env.local`の`BLOB_READ_WRITE_TOKEN`を更新

## 設定確認

すべての設定が完了したら：
```bash
npm run dev
```

でアプリケーションを起動し、データベース接続を確認してください。