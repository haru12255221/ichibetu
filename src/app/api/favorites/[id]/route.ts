import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '../../../../../lib/prisma'

// お気に入り削除API（DELETE）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔍 URLパラメータからお気に入りIDを取得（Next.js 15対応）
    const resolvedParams = await params
    const favoriteId = resolvedParams.id
    console.log('削除対象のお気に入りID:', favoriteId)

    // 🔐 セッションからユーザー情報を取得（開発用：固定ユーザー）
    const session = await getServerSession(authOptions)
    let userId: string
    
    if (session?.user?.id) {
      userId = session.user.id
    } else {
      // 開発用：固定のテストユーザーIDを使用
      userId = 'dev_test_user_fixed'
      console.log('開発用固定テストユーザーを使用:', userId)
    }

    // 👤 ユーザーが存在するかチェック
    const user = await prisma.user.findUnique({
      where: { sessionId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // 🔍 削除対象のお気に入りが存在し、かつ自分のものかチェック
    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
      include: {
        restaurant: {
          select: {
            name: true
          }
        }
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: '指定されたお気に入りが見つかりません' },
        { status: 404 }
      )
    }

    // 🛡️ 権限チェック：自分のお気に入りのみ削除可能
    if (favorite.userId !== user.id) {
      return NextResponse.json(
        { error: '他のユーザーのお気に入りは削除できません' },
        { status: 403 }
      )
    }

    // 🗑️ お気に入りを削除
    console.log('削除実行前 - お気に入りID:', favoriteId)
    console.log('削除実行前 - ユーザーID:', user.id)
    console.log('削除実行前 - お気に入りの所有者ID:', favorite.userId)
    
    const deleteResult = await prisma.favorite.delete({
      where: { id: favoriteId }
    })
    
    console.log('削除実行結果:', deleteResult)
    console.log(`お気に入り削除成功: ${favorite.restaurant.name}`)

    // ✅ 削除成功レスポンス
    return NextResponse.json({
      success: true,
      message: `「${favorite.restaurant.name}」をお気に入りから削除しました`,
      deletedFavorite: {
        id: favoriteId,
        restaurantName: favorite.restaurant.name
      }
    })

  } catch (error) {
    console.error('お気に入り削除エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}