import { getRouteByKey } from './routerConfig'
import type { RouteHandleKey } from './routerConfig'
import tabConfig from './tabConfig'

/**
 * getPathByKey — 以 handle key 取得路徑資訊
 *
 * 路徑現在統一存於 routerConfig，此函式只負責查詢邏輯：
 *
 *  查詢順序：
 *   1. routerConfig.path（靜態路由 / 靜態子路由 Tab）
 *   2. tabConfig 反查 QP Tab  → 父路由 path + searchParams: { tab: tabKey }
 *   3. tabConfig 反查 paramKey Tab → 父路由 path + /tabKey（舊專案動態路由）
 *   4. 找不到 → null
 *
 * 不再需要另外維護一份 key → path 對應表，所有 path 由 routerConfig 提供。
 */
export function getPathByKey(handleKey: string): {
  path: string
  searchParams?: Record<string, string>
} | null {
  // 1. routerConfig 直接對應
  const route = getRouteByKey(handleKey as RouteHandleKey)
  if (route?.path) return { path: route.path }

  // 2 & 3. tabConfig 反查（QP Tab / paramKey Tab）
  for (const [routeKey, entry] of Object.entries(tabConfig)) {
    for (const [tabKey, tabHandle] of Object.entries(entry.tabs)) {
      if (tabHandle.key === handleKey) {
        const parentRoute = getRouteByKey(routeKey as RouteHandleKey)
        if (!parentRoute?.path) return null

        if ('paramKey' in entry) {
          // 動態路由 Tab：路徑已含 /:param，tabKey 為 param 值
          return { path: `${parentRoute.path}/${tabKey}` }
        } else {
          // QP Tab：導到父路由 + 附加 ?tab=xxx
          return { path: parentRoute.path, searchParams: { tab: tabKey } }
        }
      }
    }
  }

  return null
}
