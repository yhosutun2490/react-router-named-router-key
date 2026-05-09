# React Router Handle Key 架構說明

以 Vite + React + React Router v6 + Tailwind + Ant Design 建立的路由測試專案。
核心目標：透過 router `handle` 物件實現**具名路由（Named Route）**概念，讓元件可以用 key 查詢路由設定，並搭配 `useMatches()` 在執行期取得當前路由資訊。

---

## 研究動機：為什麼不直接寫死 URL？

### 問題：URL 耦合導致大型專案的維護噩夢

在一般實作中，導航通常直接寫死路徑字串：

```jsx
// ❌ 直接耦合 URL
navigate('/users/profile')
<Link to="/products/electronics">電子產品</Link>
```

這在小型專案不是問題，但在大型專案會造成：

| 情境 | 後果 |
|------|------|
| URL 重新命名（`/users` → `/members`）| 全專案搜尋替換，容易遺漏 |
| 路由層級調整（`/products/:id` 移到 `/shop/products/:id`）| 所有引用此路徑的元件都需修改 |
| 多人協作 | 不同人寫出不一致的路徑格式，無法靜態檢查 |
| 路徑拼錯 | 執行期才會發現 404，無編譯期錯誤提示 |

### 解法：以 KEY 取代 URL，路由設定集中管理

```jsx
// ✅ 以 KEY 導航，與 URL 解耦
navigate(routePaths['products-list'])
navigate(generatePath('/products/:category', { category }))
```

**核心思想**：元件只認識 KEY，不認識 URL。URL 要改，只改 `router.jsx` 一個地方，所有使用 KEY 的地方自動對應到新路徑，不需要到處搜尋替換。

```
改 URL 前：所有元件都依賴路徑字串
  元件A → '/products'
  元件B → '/products'        全部都要改
  元件C → '/products'

改 URL 後：所有元件只依賴 KEY
  元件A → 'products-list'
  元件B → 'products-list'    只改 router.jsx 一處
  元件C → 'products-list'
               ↓
           router.jsx: path: 'shop/products'  ← 只動這裡
```

---

## 技術棧

| 套件 | 用途 |
|------|------|
| Vite | 建置工具 |
| React 19 | UI 框架 |
| React Router v6 | 路由管理 |
| Tailwind CSS v4 | 樣式 |
| Ant Design | UI 元件（FloatButton、Popover、Breadcrumb）|
| TypeScript | routerConfig 型別定義 |

---

## 路由結構

```
/                          ROOT     → RootLayout
├── (index)                HOME     → Home
├── /about                 ABOUT    → About
├── /users                 USERS    → UsersLayout
│   ├── (index)            USERS.LIST    → UsersList
│   └── /:id               USERS.DETAIL  → UserDetail
└── /products              PRODUCTS → ProductsLayout
    ├── (index)            PRODUCTS.LIST     → ProductsList
    └── /:category         PRODUCTS.CATEGORY → ProductCategory
```

---

## 具名路由：routerConfig + router 的結合

### 概念

React Router v6 本身沒有內建「具名路由」，但透過以下兩層設計可達到相同效果：

```
routerConfig.ts          router.jsx
────────────────         ──────────────────────────────
KEY → handle 資料   +    path 層級結構
                    ↓
             執行期：useMatches() 同時取得 pathname + handle
```

### routerConfig.ts — handle 資料層

```ts
const routerConfig = {
  'PRODUCTS.CATEGORY': {
    key: 'products-category',   // 唯一識別值（具名路由的「名稱」）
    title: '分類詳情',           // Breadcrumb 顯示文字
    description: '...',         // FloatButton Popover 說明內容
  },
} as const
```

- **`as const`**：所有值推導為 literal type，IDE 自動補全 key，不會拼錯
- **KEY 格式**：使用大寫 + 點記法（`USERS.DETAIL`）表達路由層級，一目了然
- **職責**：只管 handle 資料，不管 path

### router.jsx — 路由層級定義

```jsx
{
  path: 'products',
  element: <ProductsLayout />,
  handle: routerConfig['PRODUCTS'],       // ← 直接掛入 handle
  children: [
    {
      path: ':category',
      element: <ProductCategory />,
      handle: routerConfig['PRODUCTS.CATEGORY'],
    },
  ],
}
```

- **職責**：只管 path 與元件對應，handle 資料來自 routerConfig
- 新增路由只需在 routerConfig 加一筆，再在 router 掛上即可

---

## 以 KEY 查詢路由設定

### getHandleByKey — 以 handle.key 反查設定物件

```ts
import { getHandleByKey } from './routerConfig'

getHandleByKey('products-category')
// → { key: 'products-category', title: '分類詳情', description: '...' }

getHandleByKey('home')
// → { key: 'home', title: '首頁', description: '...' }
```

> ⚠️ **注意**：`getHandleByKey` 只能取得 handle 資料（title、description）。
> URL path 由 `router.jsx` 的層級結構決定，動態參數（`:id`、`:category`）也無法預先得知。
> **若需實際 URL，請使用 `useMatches()`**，它在執行期提供已解析完整路徑。

### useMatches — 執行期取得完整路由資訊

```jsx
import { useMatches } from 'react-router-dom'

const matches = useMatches()
// 進入 /products/electronics 時回傳：
// [
//   { pathname: '/',            handle: { key: 'root' } },
//   { pathname: '/products',    handle: { key: 'products', title: '產品' } },
//   { pathname: '/products/electronics',
//     handle: { key: 'products-category', title: '分類詳情' },
//     params: { category: 'electronics' } },
// ]
```

---

## 以 KEY 導航

React Router v6 沒有內建 `navigate('route-name')`，但可透過以下方式實作以 key 導航。

### 方案一：維護靜態 key → path 對應表

適用於**無動態參數**的靜態路由：

```ts
// src/routePaths.ts
export const routePaths: Record<string, string> = {
  'home':          '/',
  'about':         '/about',
  'users-list':    '/users',
  'products-list': '/products',
}

// 使用
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate(routePaths['products-list'])
```

### 方案二：generatePath + 參數（動態路由）

```ts
import { generatePath, useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// 導航到 /users/42
navigate(generatePath('/users/:id', { id: '42' }))

// 導航到 /products/electronics
navigate(generatePath('/products/:category', { category: 'electronics' }))
```

### 方案三：useMatches 取得當前層的 pathname 並導航

```jsx
const matches = useMatches()

// 找到 key 為 'products' 的層級並取其 pathname
const productsMatch = matches.find(m => m.handle?.key === 'products')
navigate(productsMatch.pathname)  // → '/products'
```

---

## 元件說明

### PageContainer（全域）

位於 `RootLayout` 的 `<Outlet>` 外層，所有子頁面自動套用，頁面本身不需引入。

```
useMatches()
  → 取最深層有 handle.key 的 match（當前頁面路由）
  → 頂部顯示 handle.key 標示
  → 右下角 FloatButton 點擊展開 Popover
    → 顯示 handle.title + handle.description
    → 路由切換時內容自動更新
```

### Breadcrumb（全域）

位於 `PageContainer` 上方，使用 `useMatches()` 建立麵包屑。

```
useMatches()
  → 過濾掉 ROOT（key === 'root'，為 layout 包裝層）
  → 依序顯示各層 handle.title（fallback 為 handle.key）
  → 非最後一項：加上 <Link to={match.pathname}> 可點擊導航
  → 最後一項：純文字，代表當前頁面
```

---

## 檔案結構

```
src/
├── routerConfig.ts          # handle 設定檔（as const，具名路由資料層）
├── router.jsx               # 路由結構定義（path 層級 + handle 掛載）
├── main.jsx                 # RouterProvider 入口
├── layouts/
│   ├── RootLayout.jsx       # 全域 Layout（Navbar、debug bar、Breadcrumb、PageContainer）
│   ├── UsersLayout.jsx      # /users 巢狀 Layout
│   └── ProductsLayout.jsx   # /products 巢狀 Layout
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── UsersList.jsx
│   ├── UserDetail.jsx
│   ├── ProductsList.jsx
│   └── ProductCategory.jsx
└── components/
    ├── PageContainer.jsx    # 全域頁面容器（handle.key 標示 + FloatButton Popover）
    └── Breadcrumb.jsx       # 麵包屑導航（useMatches → handle.title → Link）
```
