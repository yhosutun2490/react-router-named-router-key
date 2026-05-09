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
    title: '首頁說明',
    description: '這是應用程式的首頁，展示主要內容入口。',
  },

  'ABOUT': {
    key: 'about',
    title: '關於說明',
    description: '這裡介紹此應用的背景、技術棧與開發目的。',
  },

  'USERS': {
    key: 'users',
  },

  'USERS.LIST': {
    key: 'users-list',
    title: '使用者列表說明',
    description: '列出所有使用者，點擊可進入個別使用者的詳細頁面。',
  },

  'USERS.DETAIL': {
    key: 'users-detail',
    title: '使用者詳細說明',
    description: '顯示單一使用者的詳細資訊，路由參數 :id 對應使用者編號。',
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

export default routerConfig
