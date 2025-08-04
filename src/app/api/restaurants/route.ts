import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// 店舗一覧取得API
export async function GET(request: NextRequest) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { 
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        mainImageUrl: true,
        ownerMessage: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // ランダム順にシャッフル（スワイプアプリの特性）
    const shuffledRestaurants = restaurants.sort(() => Math.random() - 0.5)

    return NextResponse.json({
      success: true,
      data: shuffledRestaurants,
      count: shuffledRestaurants.length
    })

  } catch (error) {
    console.error('店舗一覧取得エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESTAURANTS_FETCH_ERROR',
          message: '店舗一覧の取得に失敗しました',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      },
      { status: 500 }
    )
  }
}

// 店舗登録API（後で実装）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, hours, phone, mainImageUrl, ownerMessage, story } = body

    // バリデーション
    if (!name || !address || !mainImageUrl || !ownerMessage || !story) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '必須フィールドが不足しています',
            details: {
              required: ['name', 'address', 'mainImageUrl', 'ownerMessage', 'story']
            }
          }
        },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        hours,
        phone,
        mainImageUrl,
        ownerMessage,
        story,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: restaurant,
      message: '店舗が正常に登録されました'
    })

  } catch (error) {
    console.error('店舗登録エラー:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESTAURANT_CREATE_ERROR',
          message: '店舗の登録に失敗しました',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      },
      { status: 500 }
    )
  }
}