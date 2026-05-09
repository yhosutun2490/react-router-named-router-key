import { createBrowserRouter } from 'react-router-dom'
import routerConfig from './routerConfig'
import RootLayout from './layouts/RootLayout'
import UsersLayout from './layouts/UsersLayout'
import ProductsLayout from './layouts/ProductsLayout'
import Home from './pages/Home'
import About from './pages/About'
import UsersList from './pages/UsersList'
import UserDetail from './pages/UserDetail'
import UserProfile from './pages/UserProfile'
import UserOrders from './pages/UserOrders'
import UserReviews from './pages/UserReviews'
import ProductsList from './pages/ProductsList'
import ProductCategory from './pages/ProductCategory'

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
            children: [
              {
                index: true,
                element: <UserProfile />,
                handle: routerConfig['USERS.DETAIL.PROFILE'],
              },
              {
                path: 'orders',
                element: <UserOrders />,
                handle: routerConfig['USERS.DETAIL.ORDERS'],
              },
              {
                path: 'reviews',
                element: <UserReviews />,
                handle: routerConfig['USERS.DETAIL.REVIEWS'],
              },
            ],
          },
        ],
      },
      {
        path: 'products',
        element: <ProductsLayout />,
        handle: routerConfig['PRODUCTS'],
        children: [
          {
            index: true,
            element: <ProductsList />,
            handle: routerConfig['PRODUCTS.LIST'],
          },
          {
            path: ':category',
            element: <ProductCategory />,
            handle: routerConfig['PRODUCTS.CATEGORY'],
          },
        ],
      },
    ],
  },
])

export default router
