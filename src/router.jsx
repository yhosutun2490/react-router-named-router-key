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

/**
 * 路由結構說明：
 *
 * Layout 路由分為兩種：
 *   有路徑 layout（path: '/'）→ RootLayout，所有頁面的最外層
 *   無路徑 layout（無 path）  → UsersLayout、UserDetail、ProductsLayout
 *                              只負責包裝 UI（Tabs、側邊欄），不佔路由層
 *
 * 子路由全部使用完整絕對路徑（來自 routerConfig.path），不依賴巢狀相對路徑。
 * 這讓 routerConfig 成為路徑的單一來源，router.jsx 只負責組裝結構。
 *
 * useMatches() 仍會包含無路徑 layout 的 handle，
 * 因為 React Router 會將所有 matched route（含 pathless）加入結果。
 */
const router = createBrowserRouter([
  {
    path: routerConfig['ROOT'].path,    // '/'
    element: <RootLayout />,
    handle: routerConfig['ROOT'],
    children: [
      {
        index: true,
        element: <Home />,
        handle: routerConfig['HOME'],
      },
      {
        path: routerConfig['ABOUT'].path,   // '/about'
        element: <About />,
        handle: routerConfig['ABOUT'],
      },

      // ── Users ──────────────────────────────────────────────
      // pathless layout：UsersLayout 不佔路由，只包側邊欄 UI
      {
        element: <UsersLayout />,
        handle: routerConfig['USERS'],
        children: [
          {
            path: routerConfig['USERS.LIST'].path,    // '/users'
            element: <UsersList />,
            handle: routerConfig['USERS.LIST'],
          },
          // pathless layout：UserDetail 不佔路由，只包 Tabs UI
          {
            element: <UserDetail />,
            handle: routerConfig['USERS.DETAIL'],
            children: [
              {
                path: routerConfig['USERS.DETAIL.PROFILE'].path,  // '/users/:id'
                element: <UserProfile />,
                handle: routerConfig['USERS.DETAIL.PROFILE'],
              },
              {
                path: routerConfig['USERS.DETAIL.ORDERS'].path,   // '/users/:id/orders'
                element: <UserOrders />,
                handle: routerConfig['USERS.DETAIL.ORDERS'],
              },
              {
                path: routerConfig['USERS.DETAIL.REVIEWS'].path,  // '/users/:id/reviews'
                element: <UserReviews />,
                handle: routerConfig['USERS.DETAIL.REVIEWS'],
              },
            ],
          },
        ],
      },

      // ── Products ───────────────────────────────────────────
      // pathless layout：ProductsLayout 不佔路由，只包側邊欄 UI
      {
        element: <ProductsLayout />,
        handle: routerConfig['PRODUCTS'],
        children: [
          {
            path: routerConfig['PRODUCTS.LIST'].path,      // '/products'
            element: <ProductsList />,
            handle: routerConfig['PRODUCTS.LIST'],
          },
          {
            path: routerConfig['PRODUCTS.CATEGORY'].path,  // '/products/:category'
            element: <ProductCategory />,
            handle: routerConfig['PRODUCTS.CATEGORY'],
          },
        ],
      },
    ],
  },
])

export default router
