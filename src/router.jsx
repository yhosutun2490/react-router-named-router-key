import { createBrowserRouter } from 'react-router-dom'
import routerConfig from './routerConfig'
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
    handle: routerConfig.root,
    children: [
      {
        index: true,
        element: <Home />,
        handle: routerConfig.home,
      },
      {
        path: 'about',
        element: <About />,
        handle: routerConfig.about,
      },
      {
        path: 'users',
        element: <UsersLayout />,
        handle: routerConfig.users,
        children: [
          {
            index: true,
            element: <UsersList />,
            handle: routerConfig.usersList,
          },
          {
            path: ':id',
            element: <UserDetail />,
            handle: routerConfig.userDetail,
          },
        ],
      },
    ],
  },
])

export default router
