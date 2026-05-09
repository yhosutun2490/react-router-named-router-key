/**
 * tabConfig — Query Param Tab 模式的 handle 設定
 *
 * 與 routerConfig.ts 的職責分離：
 *   routerConfig  → 路由層級的 handle（每個路由物件掛一個）
 *   tabConfig     → Query Param Tab（?tab=xxx）的 handle（同一路由內多個 Tab）
 *
 * 結構：以「路由的 handle.key」為頂層 key，
 *       其 tabs 欄位對應 ?tab= 的值 → 各 Tab 的獨立 handle
 *
 * useActiveHandle() 會以 routeHandle.key 查此設定，
 * 若找到對應的 tabs[tabKey]，回傳 Tab 的 handle 而非路由的 handle
 */
const tabConfig = {
  'users-detail': {
    defaultTab: 'profile',
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
} as const

export type TabConfigRouteKey = keyof typeof tabConfig

export type TabKey<R extends TabConfigRouteKey> = keyof (typeof tabConfig)[R]['tabs']

export type TabHandle<R extends TabConfigRouteKey> =
  (typeof tabConfig)[R]['tabs'][TabKey<R>]

export default tabConfig
