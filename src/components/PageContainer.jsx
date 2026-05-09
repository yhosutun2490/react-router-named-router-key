import { useState } from 'react'
import { FloatButton, Popover } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useActiveHandle } from '../hooks/useActiveHandle'

/**
 * PageContainer — 全域頁面容器
 *
 * 放置於 RootLayout 的 <Outlet> 外層，所有子頁面自動套用，無需個別引入。
 *
 * handle 解析委託給 useActiveHandle()，同時支援兩種 Tab 模式：
 *
 *  靜態子路由（/users/:id/orders）
 *    useMatches 最深層 = USERS.DETAIL.ORDERS
 *    → handle = { key: 'users-detail-orders', title: '購買紀錄' }
 *
 *  Query Param Tab（/users/:id?tab=orders）
 *    useMatches 最深層 = USERS.DETAIL，但 handle.tabs['orders'] 存在
 *    → handle = { key: 'users-detail-orders', title: '購買紀錄' }
 *
 *  兩種模式的 Popover 都能顯示正確的 Tab 說明。
 *
 * handle 資料流：
 *   routerConfig.ts → router.jsx → useMatches() + useSearchParams()
 *   → useActiveHandle() → PageContainer
 */
export default function PageContainer({ children }) {
  const [open, setOpen] = useState(false)

  const handle = useActiveHandle()
  const { key, title, description } = handle ?? {}

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
      {/* 當前有效 handle.key（靜態子路由 or Query Param Tab 均可正確顯示） */}
      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
        <span className="text-xs text-indigo-400">handle.key</span>
        <code className="text-xs font-mono font-semibold text-indigo-700">{key ?? 'unknown'}</code>
      </div>

      {children}

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
