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
    handle: routerConfig['ROOT'],
    children: [
      {
        index: true,
        element: <Home />,
        handle: routerConfig['HOME'],
      },
      {
        path: 'about',
        element: <About />,
        handle: routerConfig['ABOUT'],
      },
      {
        path: 'users',
        element: <UsersLayout />,
        handle: routerConfig['USERS'],
        children: [
          {
            index: true,
            element: <UsersList />,
            handle: routerConfig['USERS.LIST'],
          },
          {
            path: ':id',
            element: <UserDetail />,
            handle: routerConfig['USERS.DETAIL'],
          },
        ],
      },
    ],
  },
])

export default router
