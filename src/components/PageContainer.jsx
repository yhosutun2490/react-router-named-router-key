import { useState } from 'react'
import { useMatches } from 'react-router-dom'
import { FloatButton, Popover } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

/**
 * PageContainer — 全域頁面容器
 *
 * 放置於 RootLayout 的 <Outlet> 外層，所有子頁面自動套用，無需個別引入。
 *
 * 功能：
 * 1. 透過 useMatches() 取得當前所有 matched routes
 * 2. 從最深層（最後一個）有 handle.key 的 match 讀取 handle 資料
 *    → handle 來源為 routerConfig.ts，以 routerConfig['USERS.DETAIL'] 格式傳入 router
 * 3. 右下角 FloatButton 點擊後，在按鈕上方展開 Popover 顯示當前頁面說明
 *    → title / description 隨路由切換自動更新，不需頁面自行傳入
 *
 * handle 資料流：
 *   routerConfig.ts → router.jsx (handle: routerConfig['HOME']) → useMatches() → PageContainer
 */
export default function PageContainer({ children }) {
  const matches = useMatches()
  const [open, setOpen] = useState(false)

  // useMatches() 回傳從根到當前路由的所有 matched route 陣列
  // reverse().find() 取最深層（最具體）且有 handle.key 的那筆 → 即當前頁面
  const currentMatch = [...matches].reverse().find((m) => m.handle?.key)
  const { key, title, description } = currentMatch?.handle ?? {}

  // Popover 內容：說明文字 + handle.key 標示
  const popoverContent = (
    <div style={{ maxWidth: 240 }}>
      <p style={{ margin: 0, color: '#4b5563' }}>{description ?? '此頁面暫無說明。'}</p>
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
        <code style={{ fontSize: 11, color: '#6366f1' }}>handle.key: {key}</code>
      </div>
    </div>
  )

  return (
    <div>
      {/* 當前路由 handle.key 標示（來自 routerConfig） */}
      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
        <span className="text-xs text-indigo-400">handle.key</span>
        <code className="text-xs font-mono font-semibold text-indigo-700">{key ?? 'unknown'}</code>
      </div>

      {/* 頁面內容（由 RootLayout 的 <Outlet> 注入） */}
      {children}

      {/*
       * FloatButton + Popover
       * placement="topRight" → 展開於按鈕左上方，不遮擋頁面內容
       * trigger="click"      → 點擊開關，再點關閉
       * onOpenChange         → 同步 open state，支援點外部關閉
       */}
      <Popover
        content={popoverContent}
        title={title ?? '頁面說明'}
        open={open}
        onOpenChange={setOpen}
        placement="topRight"
        trigger="click"
      >
        <FloatButton
          icon={<QuestionCircleOutlined />}
          type="primary"
        />
      </Popover>
    </div>
  )
}
