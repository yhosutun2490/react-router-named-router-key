/**
 * routerConfig — 路由完整設定檔
 *
 * 同時包含：
 *   handle 資料（key、title、description）→ 掛入 router handle，供 useMatches 讀取
 *   path（完整絕對路徑樣板）            → 供 getPathByKey / useNavigateByKey 使用
 *
 * router.jsx 使用「無路徑 layout 路由（pathless layout route）」繼承 Layout，
 * 子路由全部指定完整 path，不依賴巢狀相對路徑。
 * 因此 path 可以直接寫完整路徑，所有設定集中在此一份檔案。
 */
const routerConfig = {
  'ROOT': {
    key: 'root',
    path: '/',
  },

  'HOME': {
    key: 'home',
    path: '/',
    title: '首頁',
    description: '這是應用程式的首頁，展示主要內容入口。',
  },

  'ABOUT': {
    key: 'about',
    path: '/about',
    title: '關於',
    description: '這裡介紹此應用的背景、技術棧與開發目的。',
  },

  // USERS / USERS.DETAIL 為 pathless layout，path 供 useNavigateByKey 反查用
  'USERS': {
    key: 'users',
    path: '/users',
    title: '使用者',
  },

  'USERS.LIST': {
    key: 'users-list',
    path: '/users',
    title: '列表',
    description: '列出所有使用者，點擊可進入個別使用者的詳細頁面。',
  },

  'USERS.DETAIL': {
    key: 'users-detail',
    path: '/users/:id',
    title: '詳細資訊',
    description: '使用者詳細頁，包含個人資料、購買紀錄、評論紀錄三個子頁籤。',
  },

  'USERS.DETAIL.PROFILE': {
    key: 'users-detail-profile',
    path: '/users/:id',
    title: '個人資料',
    description: '使用者的基本個人資訊，包含姓名、信箱、註冊日期等。',
  },

  'USERS.DETAIL.ORDERS': {
    key: 'users-detail-orders',
    path: '/users/:id/orders',
    title: '購買紀錄',
    description: '使用者的歷史訂單列表，可查詢各筆訂單的狀態與明細。',
  },

  'USERS.DETAIL.REVIEWS': {
    key: 'users-detail-reviews',
    path: '/users/:id/reviews',
    title: '評論紀錄',
    description: '使用者對商品發表過的評論列表。',
  },

  // PRODUCTS 為 pathless layout
  'PRODUCTS': {
    key: 'products',
    path: '/products',
    title: '產品',
  },

  'PRODUCTS.LIST': {
    key: 'products-list',
    path: '/products',
    title: '列表',
    description: '瀏覽所有產品分類，點擊可進入分類詳細頁面。',
  },

  'PRODUCTS.CATEGORY': {
    key: 'products-category',
    path: '/products/:category',
    title: '分類詳情',
    description: '顯示特定產品分類的詳細內容，路由參數 :category 對應分類名稱。',
  },
} as const

export type RouterConfigKey = keyof typeof routerConfig

export type RouteHandleKey =
  (typeof routerConfig)[RouterConfigKey]['key']

export type RouteHandle = {
  key: RouteHandleKey
  path?: string
  title?: string
  description?: string
}

/**
 * 以 handle.key 反查 routerConfig 完整設定（含 path）
 * path 可直接用於 generatePath()
 */
export function getRouteByKey(searchKey: RouteHandleKey) {
  return (
    (Object.values(routerConfig) as RouteHandle[]).find(
      (entry) => entry.key === searchKey,
    ) ?? null
  )
}

/** @deprecated 改用 getRouteByKey，可同時取得 path */
export function getHandleByKey(searchKey: RouteHandleKey) {
  return getRouteByKey(searchKey)
}

export default routerConfig
