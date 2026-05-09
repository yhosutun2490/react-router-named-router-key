import { Link, useMatches } from 'react-router-dom'
import { Breadcrumb as AntBreadcrumb } from 'antd'

/**
 * Breadcrumb — 動態麵包屑導航
 *
 * 資料來源：useMatches()
 * React Router 在每次路由切換後，useMatches() 會回傳從根到當前路由的
 * 所有 matched route 陣列，每筆包含：
 *   - pathname：該層的實際 URL（已帶入動態參數，如 /users/3）
 *   - handle：對應路由在 router.jsx 設定的 handle 物件（來自 routerConfig）
 *
 * 篩選邏輯：
 *   - 跳過 ROOT（key === 'root'），它是 layout 包裝層，不顯示於導航
 *   - 其餘有 handle.key 的層級依序列出
 *   - 最後一項（當前頁面）不加 Link，僅顯示文字
 *
 * 為何不需要 getHandleByKey 來取 URL：
 *   useMatches() 本身就含有 pathname，已是解析後的實際路徑，
 *   無需再從 routerConfig 反查（routerConfig 只存 handle 資料，不含 path）
 */
export default function Breadcrumb() {
  const matches = useMatches()

  const crumbs = matches
    .filter((m) => m.handle?.key && m.handle.key !== 'root')
    .map((m) => ({
      key: m.handle.key,
      label: m.handle.title ?? m.handle.key,
      pathname: m.pathname,
    }))

  if (crumbs.length === 0) return null

  return (
    <AntBreadcrumb
      className="mb-4"
      items={crumbs.map((crumb, i) => ({
        title:
          i < crumbs.length - 1 ? (
            <Link to={crumb.pathname}>{crumb.label}</Link>
          ) : (
            crumb.label
          ),
      }))}
    />
  )
}
