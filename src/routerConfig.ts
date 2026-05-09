/**
 * 路由 handle 設定檔
 * 只定義各路由的 handle 資料（key、title、description）
 * path 與層級結構由 router.jsx 負責
 */
const routerConfig = {
  'ROOT': {
    key: 'root',
  },

  'HOME': {
    key: 'home',
    title: '首頁',
    description: '這是應用程式的首頁，展示主要內容入口。',
  },

  'ABOUT': {
    key: 'about',
    title: '關於',
    description: '這裡介紹此應用的背景、技術棧與開發目的。',
  },

  'USERS': {
    key: 'users',
    title: '使用者',
  },

  'USERS.LIST': {
    key: 'users-list',
    title: '列表',
    description: '列出所有使用者，點擊可進入個別使用者的詳細頁面。',
  },

  'USERS.DETAIL': {
    key: 'users-detail',
    title: '詳細資訊',
    description: '使用者詳細頁，包含個人資料、購買紀錄、評論紀錄三個子頁籤。',
    // tabs 欄位：供 Query Param Tab 模式使用
    // key 對應 ?tab=xxx 的值，handle 定義同子路由模式
    tabs: {
      profile: { key: 'users-detail-profile', title: '個人資料', description: '使用者的基本個人資訊，包含姓名、信箱、註冊日期等。' },
      orders:  { key: 'users-detail-orders',  title: '購買紀錄', description: '使用者的歷史訂單列表，可查詢各筆訂單的狀態與明細。' },
      reviews: { key: 'users-detail-reviews', title: '評論紀錄', description: '使用者對商品發表過的評論列表。' },
    },
  },

  'USERS.DETAIL.PROFILE': {
    key: 'users-detail-profile',
    title: '個人資料',
    description: '使用者的基本個人資訊，包含姓名、信箱、註冊日期等。',
  },

  'USERS.DETAIL.ORDERS': {
    key: 'users-detail-orders',
    title: '購買紀錄',
    description: '使用者的歷史訂單列表，可查詢各筆訂單的狀態與明細。',
  },

  'USERS.DETAIL.REVIEWS': {
    key: 'users-detail-reviews',
    title: '評論紀錄',
    description: '使用者對商品發表過的評論列表。',
  },

  'PRODUCTS': {
    key: 'products',
    title: '產品',
  },

  'PRODUCTS.LIST': {
    key: 'products-list',
    title: '列表',
    description: '瀏覽所有產品分類，點擊可進入分類詳細頁面。',
  },

  'PRODUCTS.CATEGORY': {
    key: 'products-category',
    title: '分類詳情',
    description: '顯示特定產品分類的詳細內容，路由參數 :category 對應分類名稱。',
  },
} as const

export type RouterConfigKey = keyof typeof routerConfig

export type RouteHandleKey =
  (typeof routerConfig)[RouterConfigKey]['key']

export type RouteHandle = {
  key: RouteHandleKey
  title?: string
  description?: string
}

/**
 * 以 handle.key 值反查 routerConfig 設定物件
 *
 * 注意：此函式回傳的是 handle 資料（title、description 等）
 * URL path 由 router.jsx 的路由層級決定，無法從此處取得
 * 若需動態產生 URL，請搭配 useMatches() 取得實際 pathname
 *
 * @example
 * getHandleByKey('products-category')
 * // → { key: 'products-category', title: '分類詳情', description: '...' }
 */
export function getHandleByKey(searchKey: RouteHandleKey) {
  return (
    (Object.values(routerConfig) as RouteHandle[]).find(
      (entry) => entry.key === searchKey,
    ) ?? null
  )
}

export default routerConfig
