// API テスト用スクリプト
const testAPI = async () => {
  const baseURL = 'http://localhost:3000'
  
  console.log('🧪 API テストを開始します...')
  
  try {
    // 1. 店舗一覧取得テスト
    console.log('\n📋 店舗一覧取得テスト')
    const restaurantsResponse = await fetch(`${baseURL}/api/restaurants`)
    
    if (restaurantsResponse.ok) {
      const restaurantsData = await restaurantsResponse.json()
      console.log('✅ 店舗一覧取得成功')
      console.log(`📊 取得した店舗数: ${restaurantsData.count}`)
      
      if (restaurantsData.data && restaurantsData.data.length > 0) {
        const firstRestaurant = restaurantsData.data[0]
        console.log(`🏪 最初の店舗: ${firstRestaurant.name}`)
        
        // 2. 店舗詳細取得テスト
        console.log('\n🔍 店舗詳細取得テスト')
        const detailResponse = await fetch(`${baseURL}/api/restaurants/${firstRestaurant.id}`)
        
        if (detailResponse.ok) {
          const detailData = await detailResponse.json()
          console.log('✅ 店舗詳細取得成功')
          console.log(`📝 店舗名: ${detailData.data.name}`)
          console.log(`📍 住所: ${detailData.data.address}`)
          console.log(`💬 店主の一言: ${detailData.data.ownerMessage}`)
        } else {
          console.log('❌ 店舗詳細取得失敗')
        }
      }
    } else {
      console.log('❌ 店舗一覧取得失敗')
    }
    
    console.log('\n🎉 APIテスト完了！')
    
  } catch (error) {
    console.error('❌ APIテストエラー:', error.message)
    console.log('💡 開発サーバーが起動していることを確認してください')
    console.log('   コマンド: npm run dev')
  }
}

// Node.js環境でfetchを使用するための設定
if (typeof fetch === 'undefined') {
  console.log('⚠️  このスクリプトはブラウザまたはNode.js 18+で実行してください')
  console.log('💡 代わりに以下のURLを直接ブラウザで確認してください:')
  console.log('   http://localhost:3000/api/restaurants')
} else {
  testAPI()
}