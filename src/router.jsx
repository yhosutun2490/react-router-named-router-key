import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import UsersLayout from './layouts/UsersLayout'
import Home from './pages/Home'
import About from './pages/About'
import UsersList from './pages/UsersList'
import UserDetail from './pages/UserDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    handle: { key: 'root' },
    children: [
      {
        index: true,
        element: <Home />,
        handle: {
          key: 'home',
          title: '首頁說明',
          description: '這是應用程式的首頁，展示主要內容入口。',
        },
      },
      {
        path: 'about',
        element: <About />,
        handle: {
          key: 'about',
          title: '關於說明',
          description: '這裡介紹此應用的背景、技術棧與開發目的。',
        },
      },
      {
        path: 'users',
        element: <UsersLayout />,
        handle: { key: 'users' },
        children: [
          {
            index: true,
            element: <UsersList />,
            handle: {
              key: 'users-list',
              title: '使用者列表說明',
              description: '列出所有使用者，點擊可進入個別使用者的詳細頁面。',
            },
          },
          {
            path: ':id',
            element: <UserDetail />,
            handle: {
              key: 'user-detail',
              title: '使用者詳細說明',
              description: '顯示單一使用者的詳細資訊，路由參數 :id 對應使用者編號。',
            },
          },
        ],
      },
    ],
  },
])

export default router
