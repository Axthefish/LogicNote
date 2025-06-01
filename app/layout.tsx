import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { OfflineIndicator } from "@/components/offline-indicator";
import { initializeAnalytics } from "@/lib/firebase";
import { AnalyticsProvider } from "@/components/analytics-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LogicNote - 智能文本分析与知识图谱工具",
  description: "使用 AI 技术分析文本内容，自动生成知识图谱，帮助您更好地理解和组织信息。支持节点编辑、知识体系管理等功能。",
  keywords: "知识图谱, 文本分析, AI, 知识管理, 图表可视化, LogicNote",
  authors: [{ name: "LogicNote Team" }],
  creator: "LogicNote",
  publisher: "LogicNote",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://logicnote.app'),
  openGraph: {
    title: "LogicNote - 智能文本分析与知识图谱工具",
    description: "使用 AI 技术分析文本内容，自动生成知识图谱",
    url: '/',
    siteName: 'LogicNote',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LogicNote Preview',
      }
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LogicNote - 智能文本分析与知识图谱工具',
    description: '使用 AI 技术分析文本内容，自动生成知识图谱',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AnalyticsProvider>
          {children}
          <Toaster />
          <OfflineIndicator />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
