import { useMatches, useSearchParams } from 'react-router-dom'

/**
 * useActiveHandle — 取得當前頁面的有效 handle
 *
 * 解決 Query Param Tab 模式下，單一路由無法給每個 Tab 獨立 handle 的問題。
 *
 * 判斷邏輯（優先序）：
 *  1. useMatches() 取最深層有 handle.key 的路由（當前路由 handle）
 *  2. 若該 handle 含有 tabs 欄位，且 URL 有 ?tab=xxx，
 *     則回傳 handle.tabs[xxx]（該 Tab 的獨立 handle）
 *  3. 否則回傳路由本身的 handle（靜態子路由模式 or 無 Tab 頁面）
 *
 * 兩種模式均相容：
 *
 *  靜態子路由模式（本專案 /users/:id/orders）
 *    useMatches 最深層 = USERS.DETAIL.ORDERS
 *    → 直接回傳 { key: 'users-detail-orders', title: '購買紀錄' }
 *
 *  Query Param 模式（/users/:id?tab=orders）
 *    useMatches 最深層 = USERS.DETAIL（只有這一層）
 *    → handle.tabs['orders'] = { key: 'users-detail-orders', title: '購買紀錄' }
 *    → 回傳 Tab 的獨立 handle，而非父路由的 handle
 *
 * @returns {object|null} 當前有效的 handle 物件
 */
export function useActiveHandle() {
  const matches = useMatches()
  const [searchParams] = useSearchParams()

  const currentMatch = [...matches].reverse().find((m) => m.handle?.key)
  const routeHandle = currentMatch?.handle

  if (!routeHandle) return null

  // 若路由 handle 有 tabs 且 URL 帶有 ?tab=xxx，嘗試取 Tab 的 handle
  const tabKey = searchParams.get('tab')
  if (tabKey && routeHandle.tabs?.[tabKey]) {
    return routeHandle.tabs[tabKey]
  }

  return routeHandle
}
