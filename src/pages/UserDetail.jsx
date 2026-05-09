import { useParams, useMatches, useNavigate, Outlet } from 'react-router-dom'
import { Tabs } from 'antd'
import routerConfig from '../routerConfig'

/**
 * UserDetail — 使用者詳細頁（Tab layout）
 *
 * 此元件同時是 layout（含 <Outlet>）也是 Tab 控制器。
 *
 * handle 判斷邏輯：
 *   useMatches() 回傳從根到當前路由的所有 matched routes。
 *   當 URL 為 /users/1/orders 時，matches 包含：
 *     [ROOT, USERS, USERS.DETAIL, USERS.DETAIL.ORDERS]
 *
 *   取最深層有 handle.key 的 match → 就是當前 active tab 的路由
 *   將其 handle.key 設為 Tabs 的 activeKey，即可自動對應到正確 Tab
 *
 * handle 放置原則：
 *   - USERS.DETAIL     → 放在此 layout 路由，代表「詳細頁」這個層級
 *   - USERS.DETAIL.*   → 放在各 Tab 子路由，代表「哪個 Tab 被選中」
 *   Tab 的 key 值直接使用 routerConfig 的 handle.key，單一來源，不重複定義。
 */

// Tab 定義從 routerConfig 取，key 與 handle.key 一致
const TAB_ITEMS = [
  { key: routerConfig['USERS.DETAIL.PROFILE'].key, label: routerConfig['USERS.DETAIL.PROFILE'].title, path: '' },
  { key: routerConfig['USERS.DETAIL.ORDERS'].key,  label: routerConfig['USERS.DETAIL.ORDERS'].title,  path: 'orders' },
  { key: routerConfig['USERS.DETAIL.REVIEWS'].key, label: routerConfig['USERS.DETAIL.REVIEWS'].title, path: 'reviews' },
]

export default function UserDetail() {
  const { id } = useParams()
  const matches = useMatches()
  const navigate = useNavigate()

  // 最深層 match 的 handle.key = 當前 active tab
  const activeKey = [...matches].reverse().find((m) => m.handle?.key)?.handle?.key

  const handleTabChange = (key) => {
    const tab = TAB_ITEMS.find((t) => t.key === key)
    if (tab) navigate(tab.path)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">User {id}</h2>
      <p className="text-gray-400 text-sm mb-4">
        動態參數 <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">:id = {id}</code>
      </p>

      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        items={TAB_ITEMS.map(({ key, label }) => ({ key, label }))}
      />

      {/* 當前 Tab 的子路由內容 */}
      <div className="mt-2">
        <Outlet />
      </div>
    </div>
  )
}
