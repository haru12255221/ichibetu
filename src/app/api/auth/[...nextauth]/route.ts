import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    // 開発段階では認証なしで進める
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  callbacks: {
    async jwt({ token }) {
      // 簡単な匿名ユーザーID生成
      if (!token.userId) {
        token.userId = `anonymous_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.userId) {
        session.user = {
          id: token.userId as string,
          name: "匿名ユーザー",
          email: null,
          image: null,
        }
      }
      return session
    },
  },
  pages: {
    // カスタムページは使用しない
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }