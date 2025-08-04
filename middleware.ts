import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    // 匿名ユーザーの自動作成
    const token = req.nextauth.token
    
    if (!token) {
      // セッションがない場合は自動的に匿名ユーザーを作成
      // これはクライアントサイドで処理される
      return NextResponse.next()
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // すべてのリクエストを許可（匿名ユーザー対応）
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // API routesとstatic filesを除外
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}