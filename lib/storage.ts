// 開発環境用の画像ストレージ設定

// 本番環境ではVercel Blob Storageを使用
// 開発環境ではローカルファイルシステムまたは無料サービスを使用

export const uploadImage = async (file: File): Promise<string> => {
  if (process.env.NODE_ENV === 'development') {
    // 開発環境: ローカルファイルシステムに保存
    return uploadToLocal(file)
  } else {
    // 本番環境: Vercel Blob Storageまたは他のサービス
    return uploadToCloud(file)
  }
}

const uploadToLocal = async (file: File): Promise<string> => {
  // 開発環境用の実装
  // public/uploads/ フォルダに保存
  const fileName = `${Date.now()}-${file.name}`
  const publicPath = `/uploads/${fileName}`
  
  // TODO: ファイル保存の実装
  console.log('開発環境: ローカルファイルに保存予定', fileName)
  
  return publicPath
}

const uploadToCloud = async (file: File): Promise<string> => {
  // 本番環境用の実装
  // Vercel Blob Storage または Cloudinary などを使用
  throw new Error('本番環境の画像アップロード機能は未実装')
}