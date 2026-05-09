import { useParams, useMatches, useNavigate, Outlet } from 'react-router-dom'
import { generatePath } from 'react-router-dom'
import { Tabs } from 'antd'
import routerConfig from '../routerConfig'

/**
 * UserDetail — 使用者詳細頁（pathless layout + Tabs）
 *
 * 此元件為「無路徑 layout 路由」：
 *   router.jsx 中不指定 path，只有 element 與 children
 *   useMatches() 仍會包含此層的 handle（key: 'users-detail'）
 *
 * Tab 路徑來自 routerConfig.path（完整絕對路徑），
 * 搭配 generatePath 填入 :id，產生實際 URL 並 navigate。
 * 路徑改變時只需更新 routerConfig，元件不需動。
 */

const TAB_ITEMS = [
  {
    key:   routerConfig['USERS.DETAIL.PROFILE'].key,
    label: routerConfig['USERS.DETAIL.PROFILE'].title,
    path:  routerConfig['USERS.DETAIL.PROFILE'].path,   // '/users/:id'
  },
  {
    key:   routerConfig['USERS.DETAIL.ORDERS'].key,
    label: routerConfig['USERS.DETAIL.ORDERS'].title,
    path:  routerConfig['USERS.DETAIL.ORDERS'].path,    // '/users/:id/orders'
  },
  {
    key:   routerConfig['USERS.DETAIL.REVIEWS'].key,
    label: routerConfig['USERS.DETAIL.REVIEWS'].title,
    path:  routerConfig['USERS.DETAIL.REVIEWS'].path,   // '/users/:id/reviews'
  },
]

export default function UserDetail() {
  const { id } = useParams()
  const matches = useMatches()
  const navigate = useNavigate()

  const activeKey = [...matches].reverse().find((m) => m.handle?.key)?.handle?.key

  const handleTabChange = (key) => {
    const tab = TAB_ITEMS.find((t) => t.key === key)
    if (tab) navigate(generatePath(tab.path, { id }))
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
      <div className="mt-2">
        <Outlet />
      </div>
    </div>
  )
}
