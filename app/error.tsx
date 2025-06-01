'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AlertCircle className="w-24 h-24 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">出错了</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        抱歉，应用程序遇到了错误。请尝试刷新页面或稍后再试。
      </p>
      <Button onClick={reset}>
        重试
      </Button>
    </div>
  )
} 