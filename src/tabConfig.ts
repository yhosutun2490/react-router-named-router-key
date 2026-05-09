/**
 * tabConfig — Tab handle 設定
 *
 * 支援兩種 Tab 模式，以「路由的 handle.key」為頂層索引：
 *
 *  模式 A — Query Param Tab（不設 paramKey）
 *    URL: /users/1?tab=orders
 *    useActiveHandle 從 searchParams.get('tab') 取 Tab key
 *
 *  模式 B — 動態路由 Tab（設定 paramKey，給舊專案 path: ':info' 使用）
 *    URL: /users/1/orders（:info = 'orders'）
 *    useActiveHandle 從 match.params[paramKey] 取 Tab key
 *    → 無需修改 router.jsx，只要在此設定 paramKey 即可讓 useMatches 區分各 Tab
 */
const tabConfig = {

  // 模式 A：Query Param Tab（?tab=xxx）
  'users-detail': {
    defaultTab: 'profile',
    // paramKey 未設定 → 從 useSearchParams 取值
    tabs: {
      profile: {
        key: 'users-detail-profile',
        title: '個人資料',
        description: '使用者的基本個人資訊，包含姓名、信箱、註冊日期等。',
      },
      orders: {
        key: 'users-detail-orders',
        title: '購買紀錄',
        description: '使用者的歷史訂單列表，可查詢各筆訂單的狀態與明細。',
      },
      reviews: {
        key: 'users-detail-reviews',
        title: '評論紀錄',
        description: '使用者對商品發表過的評論列表。',
      },
    },
  },

  // 模式 B：動態路由 Tab（舊專案 path: ':info' 改造範例）
  // router.jsx 維持原樣：{ path: ':info', handle: { key: 'legacy-user-detail' } }
  // 只需在此加 paramKey，useActiveHandle 就能以 params.info 區分 handle
  'legacy-user-detail': {
    paramKey: 'info',        // ← 指定從哪個 route param 讀取 Tab key
    defaultTab: 'profile',
    tabs: {
      profile: {
        key: 'legacy-user-detail-profile',
        title: '個人資料',
        description: '（舊路由模式）使用者的基本個人資訊。',
      },
      orders: {
        key: 'legacy-user-detail-orders',
        title: '購買紀錄',
        description: '（舊路由模式）使用者的歷史訂單列表。',
      },
      reviews: {
        key: 'legacy-user-detail-reviews',
        title: '評論紀錄',
        description: '（舊路由模式）使用者對商品發表過的評論列表。',
      },
    },
  },

} as const

export type TabConfigRouteKey = keyof typeof tabConfig

export type TabKey<R extends TabConfigRouteKey> = keyof (typeof tabConfig)[R]['tabs']

export type TabHandle<R extends TabConfigRouteKey> =
  (typeof tabConfig)[R]['tabs'][TabKey<R>]

export default tabConfig
