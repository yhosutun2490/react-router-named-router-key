/**
 * 路由設定檔
 * 以 key-value 物件格式定義每個路由的 path 與 handle 內容
 * router.jsx 直接引用，handle 整包傳入
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
}

export default routerConfig
