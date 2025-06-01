'use client'

import { useEffect } from 'react'
import { initializeAnalytics } from '@/lib/firebase'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAnalytics().then((analytics) => {
      if (analytics) {
        console.log('Firebase Analytics initialized successfully')
      }
    }).catch((error) => {
      console.error('Failed to initialize Firebase Analytics:', error)
    })
  }, [])

  return <>{children}</>
} 