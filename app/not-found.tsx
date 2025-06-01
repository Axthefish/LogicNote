import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <FileQuestion className="w-24 h-24 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-8">页面未找到</p>
      <Button asChild>
        <Link href="/">
          返回首页
        </Link>
      </Button>
    </div>
  )
} 