'use client'

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react"

interface SessionProviderProps {
  children: React.ReactNode
}

// 自動匿名ユーザー作成コンポーネント
function AutoAnonymousUser({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  
  useEffect(() => {
    // セッションがない場合は自動的に匿名ユーザーを作成
    if (status === "unauthenticated") {
      // 簡単な匿名セッション作成（NextAuth.jsが自動的に処理）
      signIn("credentials", { redirect: false })
    }
  }, [status])
  
  // ローディング中は何も表示しない
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  return <>{children}</>
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  )
}