import { useMatches, useSearchParams } from 'react-router-dom'
import tabConfig from '../tabConfig'

/**
 * useActiveHandle — 取得當前頁面的有效 handle
 *
 * 設定來源分離：
 *   routerConfig  → 路由層級 handle，由 useMatches() 取得
 *   tabConfig     → Query Param Tab handle，以路由 handle.key 為索引查詢
 *
 * 判斷邏輯（優先序）：
 *  1. useMatches() 取最深層有 handle.key 的路由 handle
 *  2. 以該 handle.key 查詢 tabConfig，若存在對應的 tabs 設定，
 *     再以 ?tab=xxx 取出該 Tab 的獨立 handle
 *  3. 否則回傳路由本身的 handle
 *
 * 兩種模式均相容：
 *
 *  靜態子路由（/users/:id/orders）
 *    useMatches 最深層 = USERS.DETAIL.ORDERS
 *    tabConfig 無此 key → 直接回傳路由 handle
 *    → { key: 'users-detail-orders', title: '購買紀錄' }
 *
 *  Query Param Tab（/users/:id?tab=orders）
 *    useMatches 最深層 = USERS.DETAIL
 *    tabConfig['users-detail'].tabs['orders'] 存在
 *    → { key: 'users-detail-orders', title: '購買紀錄' }
 */
export function useActiveHandle() {
  const matches = useMatches()
  const [searchParams] = useSearchParams()

  const currentMatch = [...matches].reverse().find((m) => m.handle?.key)
  const routeHandle = currentMatch?.handle

  if (!routeHandle) return null

  // 以路由 handle.key 查 tabConfig，確認此路由是否有 QP Tab 設定
  const tabConfigEntry = tabConfig[routeHandle.key]
  if (tabConfigEntry) {
    const tabKey = searchParams.get('tab') ?? tabConfigEntry.defaultTab
    const tabHandle = tabConfigEntry.tabs[tabKey]
    if (tabHandle) return tabHandle
  }

  return routeHandle
}
