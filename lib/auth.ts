import { getServerSession } from "next-auth/next"
import { authOptions } from "../src/app/api/auth/[...nextauth]/route"
import { prisma } from "./prisma"
import { randomUUID } from "crypto"

// サーバーサイドでセッションを取得
export async function getServerAuthSession() {
  return await getServerSession(authOptions)
}

// 匿名ユーザーを作成または取得
export async function getOrCreateAnonymousUser(sessionId?: string) {
  if (sessionId) {
    // 既存のユーザーを検索
    const existingUser = await prisma.user.findUnique({
      where: { sessionId }
    })
    
    if (existingUser) {
      return existingUser
    }
  }
  
  // 新しい匿名ユーザーを作成
  const newSessionId = randomUUID()
  const user = await prisma.user.create({
    data: {
      sessionId: newSessionId,
    },
  })
  
  return user
}

// ユーザーIDからユーザー情報を取得
export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      favorites: {
        include: {
          restaurant: true
        }
      }
    }
  })
}