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
    path: routerConfig.root.path,
    element: <RootLayout />,
    handle: routerConfig.root.handle,
    children: [
      {
        index: true,
        element: <Home />,
        handle: routerConfig.home.handle,
      },
      {
        path: routerConfig.about.path,
        element: <About />,
        handle: routerConfig.about.handle,
      },
      {
        path: routerConfig.users.path,
        element: <UsersLayout />,
        handle: routerConfig.users.handle,
        children: [
          {
            index: true,
            element: <UsersList />,
            handle: routerConfig.usersList.handle,
          },
          {
            path: routerConfig.userDetail.path,
            element: <UserDetail />,
            handle: routerConfig.userDetail.handle,
          },
        ],
      },
    ],
  },
])

export default router
