# データベース代替案

## 現在の設定: SQLite（開発用）
✅ **設定完了** - ローカル開発用にSQLiteを使用中

## その他の無料データベース選択肢

### 1. Supabase（推奨）
- **無料枠**: 500MB、50,000リクエスト/月
- **特徴**: PostgreSQL、リアルタイム機能、認証機能内蔵
- **設定方法**:
  1. https://supabase.com でアカウント作成
  2. 新しいプロジェクト作成
  3. 接続文字列を取得
  4. `prisma/schema.prisma`のproviderを`postgresql`に変更

### 2. Railway（無料枠あり）
- **無料枠**: $5/月のクレジット
- **特徴**: PostgreSQL、MySQL対応
- **設定方法**:
  1. https://railway.app でアカウント作成
  2. PostgreSQLまたはMySQLデータベース作成

### 3. Neon（PostgreSQL）
- **無料枠**: 512MB、10GB転送/月
- **特徴**: サーバーレスPostgreSQL
- **設定方法**:
  1. https://neon.tech でアカウント作成
  2. データベース作成

## 本番環境への移行

開発が完了したら、以下の手順で本番環境に移行：

1. 本番用データベースサービスを選択
2. `prisma/schema.prisma`を更新
3. 環境変数を更新
4. `npx prisma db push`でスキーマ同期
5. データ移行（必要に応じて）

## 現在の開発環境
- **データベース**: SQLite (`./dev.db`)
- **接続**: ローカルファイル
- **利点**: 設定不要、高速、オフライン動作