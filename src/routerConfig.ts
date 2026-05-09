/**
 * 路由設定檔（TypeScript）
 * as const 確保所有值為 literal type，引用時可得到精確的 key 提示
 */
const routerConfig = {
  root: {
    path: '/',
    handle: {
      key: 'root',
    },
  },

  home: {
    path: '/',
    handle: {
      key: 'home',
      title: '首頁說明',
      description: '這是應用程式的首頁，展示主要內容入口。',
    },
  },

  about: {
    path: 'about',
    handle: {
      key: 'about',
      title: '關於說明',
      description: '這裡介紹此應用的背景、技術棧與開發目的。',
    },
  },

  users: {
    path: 'users',
    handle: {
      key: 'users',
    },
  },

  usersList: {
    path: 'users',
    handle: {
      key: 'users-list',
      title: '使用者列表說明',
      description: '列出所有使用者，點擊可進入個別使用者的詳細頁面。',
    },
  },

  userDetail: {
    path: ':id',
    handle: {
      key: 'user-detail',
      title: '使用者詳細說明',
      description: '顯示單一使用者的詳細資訊，路由參數 :id 對應使用者編號。',
    },
  },
} as const

// 所有頂層 key 的 union type
// → 'root' | 'home' | 'about' | 'users' | 'usersList' | 'userDetail'
export type RouterConfigKey = keyof typeof routerConfig

// handle.key 的 union type（從 as const 推導出精確的 literal）
// → 'root' | 'home' | 'about' | 'users' | 'users-list' | 'user-detail'
export type RouteHandleKey =
  (typeof routerConfig)[RouterConfigKey]['handle']['key']

// handle 物件的型別（給 PageContainer 使用）
export type RouteHandle = {
  key: RouteHandleKey
  title?: string
  description?: string
}

export default routerConfig
