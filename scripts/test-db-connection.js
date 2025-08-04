const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('データベース接続をテスト中...')
    
    // 簡単な接続テスト
    await prisma.$connect()
    console.log('✅ データベース接続成功!')
    
    // テーブルの存在確認（まだマイグレーションしていない場合はエラーになる可能性があります）
    try {
      const restaurantCount = await prisma.restaurant.count()
      console.log(`📊 現在の店舗数: ${restaurantCount}`)
    } catch (error) {
      console.log('⚠️  テーブルがまだ存在しません（マイグレーションが必要）')
    }
    
  } catch (error) {
    console.error('❌ データベース接続エラー:', error.message)
    console.error('DATABASE_URLを確認してください')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()