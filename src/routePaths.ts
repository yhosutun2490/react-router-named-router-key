import type { RouteHandleKey } from './routerConfig'
import tabConfig from './tabConfig'

/**
 * routePaths — handle key → URL path pattern 對應表
 *
 * 職責：提供「以 handle key 導航」的路徑樣板
 * 搭配 generatePath() 填入動態參數，產生實際 URL
 *
 * 與 routerConfig 的差異：
 *   routerConfig  → handle 資料（title、description），掛在 router handle 欄位
 *   routePaths    → 導航用的完整 path pattern，給 useNavigateByKey 使用
 *
 * 注意：
 *   - 動態參數使用 React Router 格式（:id、:category）
 *   - Query Param Tab（?tab=xxx）的路徑指向父路由，
 *     useNavigateByKey 會自動附加 ?tab= 參數
 */
export const routePaths: Partial<Record<RouteHandleKey, string>> = {
  // 靜態路由
  'home':           '/',
  'about':          '/about',

  // Users
  'users':          '/users',
  'users-list':     '/users',
  'users-detail':   '/users/:id',

  // Users 靜態子路由 Tab
  'users-detail-profile': '/users/:id',           // index → /users/:id
  'users-detail-orders':  '/users/:id/orders',
  'users-detail-reviews': '/users/:id/reviews',

  // Products
  'products':          '/products',
  'products-list':     '/products',
  'products-category': '/products/:category',
}

/**
 * getPathByKey — 以 handle key 取得路徑資訊
 *
 * 回傳：
 *   { path, searchParams }
 *   - path：generatePath 所需的 path pattern
 *   - searchParams：需要附加的 query string（QP Tab 模式使用）
 *
 * 查詢順序：
 *   1. routePaths 直接對應（靜態路由 / 靜態子路由 Tab）
 *   2. tabConfig 反查（QP Tab / 動態路由 Tab）
 *      → 找到所屬父路由的 path，並附帶 ?tab= 或 /:param 資訊
 */
export function getPathByKey(handleKey: string): {
  path: string
  searchParams?: Record<string, string>
} | null {
  // 1. 直接對應
  const directPath = routePaths[handleKey as RouteHandleKey]
  if (directPath) return { path: directPath }

  // 2. 從 tabConfig 反查（QP Tab / paramKey Tab）
  for (const [routeKey, entry] of Object.entries(tabConfig)) {
    for (const [tabKey, tabHandle] of Object.entries(entry.tabs)) {
      if (tabHandle.key === handleKey) {
        const parentPath = routePaths[routeKey as RouteHandleKey]
        if (!parentPath) return null

        if ('paramKey' in entry) {
          // 動態路由 Tab：路徑已包含 /:param，不需要額外 searchParams
          return { path: `${parentPath}/${tabKey}` }
        } else {
          // QP Tab：導到父路由 + 附加 ?tab=xxx
          return { path: parentPath, searchParams: { tab: tabKey } }
        }
      }
    }
  }

  return null
}
