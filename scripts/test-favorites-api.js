// お気に入りAPI テスト用スクリプト
const testFavoritesAPI = async () => {
  const baseURL = 'http://localhost:3000'
  
  console.log('🧪 お気に入りAPI テストを開始します...')
  
  try {
    // 1. 店舗一覧を取得して、テスト用の店舗IDを取得
    console.log('\n📋 テスト用店舗データを取得中...')
    const restaurantsResponse = await fetch(`${baseURL}/api/restaurants`)
    
    if (!restaurantsResponse.ok) {
      throw new Error('店舗一覧の取得に失敗しました')
    }
    
    const restaurantsData = await restaurantsResponse.json()
    if (!restaurantsData.data || restaurantsData.data.length === 0) {
      throw new Error('テスト用の店舗データがありません')
    }
    
    const testRestaurant = restaurantsData.data[0]
    console.log(`✅ テスト用店舗: ${testRestaurant.name}`)
    
    // 2. お気に入り一覧取得テスト（空の状態）
    console.log('\n📋 お気に入り一覧取得テスト（初期状態）')
    const initialFavoritesResponse = await fetch(`${baseURL}/api/favorites`)
    
    if (initialFavoritesResponse.ok) {
      const initialFavoritesData = await initialFavoritesResponse.json()
      console.log('✅ お気に入り一覧取得成功（初期状態）')
      console.log(`📊 お気に入り数: ${initialFavoritesData.count}`)
      console.log(`💬 メッセージ: ${initialFavoritesData.message}`)
    } else {
      console.log('❌ お気に入り一覧取得失敗（初期状態）')
    }
    
    // 3. お気に入り追加テスト
    console.log('\n❤️  お気に入り追加テスト')
    const addFavoriteResponse = await fetch(`${baseURL}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantId: testRestaurant.id
      })
    })
    
    if (addFavoriteResponse.ok) {
      const addFavoriteData = await addFavoriteResponse.json()
      console.log('✅ お気に入り追加成功')
      console.log(`💬 メッセージ: ${addFavoriteData.message}`)
      console.log(`🏪 追加した店舗: ${addFavoriteData.favorite.restaurant.name}`)
    } else {
      const errorData = await addFavoriteResponse.json()
      console.log('❌ お気に入り追加失敗')
      console.log(`❌ エラー: ${errorData.error}`)
    }
    
    // 4. お気に入り一覧取得テスト（データがある状態）
    console.log('\n📋 お気に入り一覧取得テスト（データあり）')
    const favoritesResponse = await fetch(`${baseURL}/api/favorites`)
    
    if (favoritesResponse.ok) {
      const favoritesData = await favoritesResponse.json()
      console.log('✅ お気に入り一覧取得成功（データあり）')
      console.log(`📊 お気に入り数: ${favoritesData.count}`)
      console.log(`💬 メッセージ: ${favoritesData.message}`)
      
      if (favoritesData.favorites && favoritesData.favorites.length > 0) {
        console.log('\n📝 お気に入りリスト:')
        favoritesData.favorites.forEach((favorite, index) => {
          console.log(`  ${index + 1}. ${favorite.restaurant.name}`)
          console.log(`     💬 ${favorite.restaurant.ownerMessage}`)
          console.log(`     📍 ${favorite.restaurant.address}`)
          console.log(`     🆔 ID: ${favorite.id}`)
        })
      }
    } else {
      console.log('❌ お気に入り一覧取得失敗（データあり）')
    }
    
    // 5. 重複追加テスト
    console.log('\n🔄 重複追加テスト')
    const duplicateResponse = await fetch(`${baseURL}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantId: testRestaurant.id
      })
    })
    
    if (duplicateResponse.status === 409) {
      const duplicateData = await duplicateResponse.json()
      console.log('✅ 重複チェック正常動作')
      console.log(`💬 メッセージ: ${duplicateData.error}`)
    } else {
      console.log('❌ 重複チェック異常')
    }
    
    console.log('\n🎉 お気に入りAPIテスト完了！')
    
  } catch (error) {
    console.error('❌ お気に入りAPIテストエラー:', error.message)
    console.log('💡 開発サーバーが起動していることを確認してください')
    console.log('   コマンド: npm run dev')
  }
}

// Node.js環境でfetchを使用するための設定
if (typeof fetch === 'undefined') {
  console.log('⚠️  このスクリプトはブラウザまたはNode.js 18+で実行してください')
  console.log('💡 代わりに以下のURLを直接ブラウザで確認してください:')
  console.log('   GET: http://localhost:3000/api/favorites')
} else {
  testFavoritesAPI()
}