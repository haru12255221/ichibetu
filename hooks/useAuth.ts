'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * 認証管理フック
 * 一瞥アプリの心を持つユーザー管理
 */
export function useAuth() {
  // 開発段階では固定の匿名ユーザーを返す
  const [userId] = useState(() => `dev_user_${Date.now()}`);
  
  return {
    user: { 
      id: userId, 
      name: "開発用ユーザー",
      sessionId: userId 
    },
    userId: userId,
    sessionId: userId,
    isLoading: false,
    isAuthenticated: true,
  };
  
  // 後で認証機能を有効化する場合は以下のコメントアウトを解除
  /*
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (status !== "loading") {
      setIsReady(true);
    }
  }, [status]);
  
  return {
    user: session?.user,
    userId: session?.user?.id,
    sessionId: (session?.user as any)?.sessionId,
    isLoading: status === "loading" || !isReady,
    isAuthenticated: !!session?.user,
  };
  */
}

/**
 * ユーザー情報型定義
 */
export interface User {
  id: string;
  name: string;
  sessionId: string;
}

/**
 * 認証状態型定義
 */
export interface AuthState {
  user: User | null;
  userId: string | null;
  sessionId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}