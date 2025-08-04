import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// 店舗詳細取得API
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_RESTAURANT_ID',
            message: '店舗IDが指定されていません'
          }
        },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { 
        id: id,
        isActive: true 
      },
      include: {
        favorites: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESTAURANT_NOT_FOUND',
            message: '指定された店舗が見つかりません'
          }
        },
        { status: 404 }
      )
    }

    // お気に入り数を計算
    const favoriteCount = restaurant.favorites.length

    // レスポンスデータを整形
    const responseData = {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      hours: restaurant.hours,
      phone: restaurant.phone,
      mainImageUrl: restaurant.mainImageUrl,
      ownerMessage: restaurant.ownerMessage,
      story: restaurant.story,
      favoriteCount,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt
    }

    return NextResponse.json({
      success: true,
      data: responseData
    })

  } catch (error) {
    console.error('店舗詳細取得エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESTAURANT_DETAIL_ERROR',
          message: '店舗詳細の取得に失敗しました',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      },
      { status: 500 }
    )
  }
}