import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '../../../../lib/prisma'

// お気に入り追加API（POST）
export async function POST(request: NextRequest) {
  try {
    // セッションからユーザー情報を取得（開発用：セッションがない場合はテストユーザーを使用）
    const session = await getServerSession(authOptions)
    let userId: string
    
    if (session?.user?.id) {
      userId = session.user.id
    } else {
      // 開発用：セッションがない場合はテストユーザーIDを使用
      userId = 'test_user_' + Date.now()
      console.log('開発用テストユーザーを使用:', userId)
    }

    // リクエストボディから店舗IDを取得
    const { restaurantId } = await request.json()
    if (!restaurantId) {
      return NextResponse.json(
        { error: '店舗IDが必要です' },
        { status: 400 }
      )
    }

    // 店舗が存在するかチェック
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    })
    if (!restaurant) {
      return NextResponse.json(
        { error: '指定された店舗が見つかりません' },
        { status: 404 }
      )
    }

    // ユーザーが存在しない場合は作成し、実際のユーザーIDを取得
    const user = await prisma.user.upsert({
      where: { sessionId: userId },
      update: {},
      create: {
        sessionId: userId
      }
    })

    // 既にお気に入りに追加されているかチェック
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,  // sessionIdではなく、実際のuser.idを使用
          restaurantId: restaurantId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'この店舗は既にお気に入りに追加されています' },
        { status: 409 }
      )
    }

    // お気に入りを追加
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,  // sessionIdではなく、実際のuser.idを使用
        restaurantId: restaurantId
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            mainImageUrl: true,
            ownerMessage: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'お気に入りに追加しました',
      favorite: favorite
    })

  } catch (error) {
    console.error('お気に入り追加エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}