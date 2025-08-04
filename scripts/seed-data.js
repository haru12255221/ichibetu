const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleRestaurants = [
  {
    name: "和食処 さくら",
    address: "東京都渋谷区神南1-1-1",
    hours: "11:30-14:00, 17:30-22:00",
    phone: "03-1234-5678",
    mainImageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    ownerMessage: "四季の味を大切に、心を込めてお作りしています",
    story: "創業50年の老舗和食店です。祖父から受け継いだ伝統の味を守りながら、現代の感性も取り入れた料理をお出ししています。特に、季節の食材を活かした会席料理は多くのお客様にご好評いただいております。一期一会の心でお客様をお迎えいたします。"
  },
  {
    name: "Bistro Luna",
    address: "東京都港区六本木3-2-1",
    hours: "18:00-24:00",
    phone: "03-2345-6789",
    mainImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    ownerMessage: "フランスで学んだ本格的な味をカジュアルに",
    story: "パリの三つ星レストランで修行を積んだシェフが、本格的なフレンチをもっと身近に感じてもらいたいという想いで開いたビストロです。厳選した食材と伝統的な技法で作る料理は、特別な日にも普段使いにも最適です。ワインとのマリアージュもお楽しみください。"
  },
  {
    name: "麺屋 龍",
    address: "東京都新宿区歌舞伎町2-3-4",
    hours: "11:00-15:00, 18:00-23:00",
    phone: "03-3456-7890",
    mainImageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    ownerMessage: "魂を込めた一杯で、お客様を笑顔に",
    story: "ラーメン一筋30年の店主が、試行錯誤を重ねて完成させた自慢のスープ。豚骨と鶏ガラを18時間煮込んだ濃厚なスープに、自家製麺が絡む至極の一杯です。深夜まで営業しているので、仕事帰りの方にも愛されています。一杯一杯に込めた想いを味わってください。"
  },
  {
    name: "Cafe Mellow",
    address: "東京都世田谷区三軒茶屋1-4-5",
    hours: "8:00-20:00",
    phone: "03-4567-8901",
    mainImageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    ownerMessage: "ゆったりとした時間を過ごせる隠れ家カフェ",
    story: "住宅街の静かな一角にある小さなカフェです。自家焙煎のコーヒーと手作りのスイーツで、お客様にほっと一息つける時間を提供したいと思っています。本を読んだり、友人との会話を楽しんだり、思い思いの時間をお過ごしください。猫のマスターも皆様をお待ちしています。"
  },
  {
    name: "焼肉 炎",
    address: "東京都品川区大井町5-6-7",
    hours: "17:00-24:00",
    phone: "03-5678-9012",
    mainImageUrl: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800",
    ownerMessage: "最高級の和牛で、特別な夜を演出します",
    story: "A5ランクの和牛のみを使用した焼肉店です。肉の目利きには絶対の自信があり、その日一番美味しい部位をお客様にご提供しています。炭火で焼く肉の香ばしさと、とろけるような食感をお楽しみください。記念日や大切な方との食事に最適な空間をご用意しています。"
  }
]

async function seedData() {
  console.log('サンプルデータを投入中...')
  
  try {
    // 既存のデータをクリア
    await prisma.favorite.deleteMany({})
    await prisma.restaurant.deleteMany({})
    
    // サンプルデータを投入
    for (const restaurant of sampleRestaurants) {
      await prisma.restaurant.create({
        data: restaurant
      })
      console.log(`✅ ${restaurant.name} を追加しました`)
    }
    
    console.log('🎉 サンプルデータの投入が完了しました！')
    
    // 投入されたデータを確認
    const count = await prisma.restaurant.count()
    console.log(`📊 現在の店舗数: ${count}`)
    
  } catch (error) {
    console.error('❌ サンプルデータ投入エラー:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedData()