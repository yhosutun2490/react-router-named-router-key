import { useState } from 'react'
import { useMatches } from 'react-router-dom'
import { FloatButton, Popover } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export default function PageContainer({ children }) {
  const matches = useMatches()
  const [open, setOpen] = useState(false)

  const currentMatch = [...matches].reverse().find((m) => m.handle?.key)
  const { key, title, description } = currentMatch?.handle ?? {}

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
      {/* handle.key 標示 */}
      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
        <span className="text-xs text-indigo-400">handle.key</span>
        <code className="text-xs font-mono font-semibold text-indigo-700">{key ?? 'unknown'}</code>
      </div>

      {/* 頁面內容 */}
      {children}

      {/* Popover 包住 FloatButton，點擊在按鈕上方展開說明 */}
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
