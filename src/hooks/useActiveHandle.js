import { useMatches, useSearchParams } from 'react-router-dom'
import tabConfig from '../tabConfig'

/**
 * useActiveHandle — 取得當前頁面的有效 handle
 *
 * 設定來源：
 *   routerConfig  → 路由層級 handle，由 useMatches() 取得
 *   tabConfig     → Tab handle 群組，以路由 handle.key 為索引
 *
 * 支援三種模式（優先序由上到下）：
 *
 *  1. 靜態子路由（/users/:id/orders）
 *     useMatches 最深層直接是 USERS.DETAIL.ORDERS
 *     tabConfig 查不到 → 直接回傳路由 handle
 *     → { key: 'users-detail-orders' }
 *
 *  2. 動態路由 Tab，tabConfig 有 paramKey（舊專案 /users/:id/:info）
 *     useMatches 最深層 = 'legacy-user-detail'
 *     tabConfig['legacy-user-detail'].paramKey = 'info'
 *     → 從 match.params['info'] 取 Tab key（不讀 searchParams）
 *     → { key: 'legacy-user-detail-orders' }
 *
 *  3. Query Param Tab，tabConfig 無 paramKey（/users/:id?tab=orders）
 *     useMatches 最深層 = 'users-detail'
 *     tabConfig['users-detail'] 無 paramKey
 *     → 從 searchParams.get('tab') 取 Tab key
 *     → { key: 'users-detail-orders' }
 */
export function useActiveHandle() {
  const matches = useMatches()
  const [searchParams] = useSearchParams()

  const currentMatch = [...matches].reverse().find((m) => m.handle?.key)
  const routeHandle = currentMatch?.handle

  if (!routeHandle) return null

  const tabConfigEntry = tabConfig[routeHandle.key]
  if (tabConfigEntry) {
    // 模式 B：paramKey 存在 → 從 route params 取 Tab key（動態路由舊專案）
    // 模式 A：無 paramKey  → 從 searchParams 取 Tab key（Query Param）
    const tabKey = tabConfigEntry.paramKey
      ? (currentMatch.params[tabConfigEntry.paramKey] ?? tabConfigEntry.defaultTab)
      : (searchParams.get('tab') ?? tabConfigEntry.defaultTab)

    const tabHandle = tabConfigEntry.tabs[tabKey]
    if (tabHandle) return tabHandle
  }

  return routeHandle
}
