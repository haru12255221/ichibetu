import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '../../../../lib/prisma'

// お気に入り一覧取得API（GET）
export async function GET(request: NextRequest) {
  try {
    // セッションからユーザー情報を取得（開発用：セッションがない場合はテストユーザーを使用）
    const session = await getServerSession(authOptions)
    let userId: string
    
    if (session?.user?.id) {
      userId = session.user.id
    } else {
      // 開発用：固定のテストユーザーIDを使用
      userId = 'dev_test_user_fixed'
      console.log('開発用固定テストユーザーを使用:', userId)
    }

    // ユーザーが存在するかチェック
    const user = await prisma.user.findUnique({
      where: { sessionId: userId }
    })

    if (!user) {
      // ユーザーが存在しない場合は空のリストを返す
      return NextResponse.json({
        favorites: [],
        message: 'お気に入りはまだありません'
      })
    }

    // お気に入り一覧を取得（店舗情報を含む）
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            mainImageUrl: true,
            ownerMessage: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' } // 作成日時順（新しい順）
    })

    return NextResponse.json({
      favorites: favorites,
      count: favorites.length,
      message: favorites.length > 0 ? `${favorites.length}件のお気に入りがあります` : 'お気に入りはまだありません'
    })

  } catch (error) {
    console.error('お気に入り一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// お気に入り追加API（POST）
export async function POST(request: NextRequest) {
  try {
    // セッションからユーザー情報を取得（開発用：セッションがない場合はテストユーザーを使用）
    const session = await getServerSession(authOptions)
    let userId: string
    
    if (session?.user?.id) {
      userId = session.user.id
    } else {
      // 開発用：固定のテストユーザーIDを使用
      userId = 'dev_test_user_fixed'
      console.log('開発用固定テストユーザーを使用:', userId)
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