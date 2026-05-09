import { useNavigate, generatePath } from 'react-router-dom'
import { getPathByKey } from '../routePaths'

/**
 * useNavigateByKey — 以 handle key 跨層導航
 *
 * 讓任何元件不需要知道目標路由的 URL，只需要知道 handle key。
 * URL 變動時只改 routePaths.ts，所有使用 key 的導航自動對應新路徑。
 *
 * @returns navigateByKey(key, params?, options?)
 *
 * @param key        - handle key（來自 routerConfig 或 tabConfig）
 * @param params     - 動態路由參數，e.g. { id: '1', category: 'books' }
 * @param options    - React Router navigate options，e.g. { replace: true }
 *
 * @example
 * // 靜態路由
 * navigateByKey('about')
 * // → navigate('/about')
 *
 * // 動態路由（需傳 params）
 * navigateByKey('users-detail', { id: '3' })
 * // → navigate('/users/3')
 *
 * // 靜態子路由 Tab（需傳 params）
 * navigateByKey('users-detail-orders', { id: '3' })
 * // → navigate('/users/3/orders')
 *
 * // QP Tab（父路由 + ?tab=）
 * navigateByKey('users-detail-orders', { id: '3' })
 * // 若此 key 屬於 QP tabConfig → navigate('/users/3?tab=orders')
 */
export function useNavigateByKey() {
  const navigate = useNavigate()

  return function navigateByKey(key, params = {}, options = {}) {
    const result = getPathByKey(key)

    if (!result) {
      console.warn(`[useNavigateByKey] No path found for handle key: "${key}"`)
      return
    }

    const resolvedPath = generatePath(result.path, params)

    // QP Tab 模式：附加 ?tab= 等 search params
    if (result.searchParams) {
      const query = new URLSearchParams(result.searchParams).toString()
      navigate(`${resolvedPath}?${query}`, options)
    } else {
      navigate(resolvedPath, options)
    }
  }
}
