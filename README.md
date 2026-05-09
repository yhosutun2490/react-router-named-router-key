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

## 路由設計原則：Tab 子頁應用靜態路徑，而非動態路由

### 情境：使用者詳細頁有三個 Tab

```
個人資料 ／ 購買紀錄 ／ 評論紀錄
```

### ❌ 錯誤做法：用 `:info` 動態路由切換 Tab

```
/users/:id/:info
```

```jsx
// router.jsx — 三個 Tab 共用同一個路由物件
{
  path: ':info',            // 'profile' | 'orders' | 'reviews' 全打這
  element: <UserDetail />,
  handle: routerConfig['USERS.DETAIL'],  // 只能放一個 handle，無法區分 Tab
}

// UserDetail.jsx — 元件內部自己判斷
const { info } = useParams()
if (info === 'profile') return <Profile />
if (info === 'orders')  return <Orders />
```

**問題：**

| 問題 | 說明 |
|------|------|
| handle 無法各自設定 | 三個 Tab 共用同一路由，`useMatches()` 分不出哪個 Tab 被選中 |
| 路由失去語意 | `:info` 可接受任意字串，打錯也不報錯，router 不做限制 |
| 判斷邏輯污染元件 | Tab 顯示邏輯全擠在元件內部，if/switch 隨頁面增長 |
| 無法獨立設定 loader / errorElement | 三個 Tab 若資料來源不同，無法在 router 層個別處理 |

---

### ✅ 正確做法：每個 Tab 對應獨立靜態路由

```
/users/:id/profile    → USERS.DETAIL.PROFILE
/users/:id/orders     → USERS.DETAIL.ORDERS
/users/:id/reviews    → USERS.DETAIL.REVIEWS
```

```jsx
// router.jsx — 每個 Tab 是獨立路由，各自掛 handle
{
  path: ':id',
  element: <UserDetail />,          // 升級為 layout（含 Tabs + Outlet）
  handle: routerConfig['USERS.DETAIL'],
  children: [
    { index: true,      element: <UserProfile />, handle: routerConfig['USERS.DETAIL.PROFILE'] },
    { path: 'orders',   element: <UserOrders />,  handle: routerConfig['USERS.DETAIL.ORDERS'] },
    { path: 'reviews',  element: <UserReviews />, handle: routerConfig['USERS.DETAIL.REVIEWS'] },
  ],
}
```

```jsx
// UserDetail.jsx — useMatches() 直接告知哪個 Tab 被選中，元件零判斷邏輯
const activeKey = [...matches].reverse().find(m => m.handle?.key)?.handle?.key
// /users/1/orders → activeKey = 'users-detail-orders'

<Tabs activeKey={activeKey} onChange={handleTabChange} />
<Outlet />   {/* Tab 內容由子路由渲染，UserDetail 不需要知道內容 */}
```

**優點：**

| 優點 | 說明 |
|------|------|
| handle 各自獨立 | 每個 Tab 有自己的 key / title / description |
| `useMatches()` 精確識別 | 最深層 handle.key 就是當前 Tab，不需要任何判斷 |
| 元件職責單一 | UserDetail 只管 Tabs UI，內容交給子路由元件 |
| 可獨立擴充 | 各 Tab 可各自加 loader、errorElement、guard |
| URL 可書籤化 | 每個 Tab 有獨立 URL，重新整理或分享連結都能還原狀態 |

---

### 動態路由 vs 靜態路徑的判斷準則

```
用靜態路徑：Tab 數量固定、名稱固定、由開發者決定
  /users/:id/profile   ✅
  /users/:id/orders    ✅
  /users/:id/reviews   ✅

用動態路由：內容由資料驅動、數量不固定、來自 API 或資料庫
  /users/:id           ✅  id 來自資料庫
  /products/:category  ✅  category 來自商品分類資料
  /posts/:slug         ✅  slug 來自文章內容
  /users/:id/:info     ❌  info 只是幾個固定 Tab，不需要動態
```

---

## Tab 是路由狀態還是 UI 狀態？

企業專案中常見的另一種模式：**Tab 點擊只切換元件，URL 不跟著換路由**。
這與上面的「靜態子路由 Tab」是不同的設計，兩者都合法，差異在於 **Tab 代表什麼**。

### 三種模式比較

| 模式 | URL 變化 | handle.key | 適用情境 |
|------|---------|-----------|---------|
| **靜態子路由** | `/users/1` → `/users/1/orders` | 每個 Tab 有獨立 handle | Tab 代表不同頁面，需要書籤化、分享連結 |
| **Query Param** | `/users/1` → `/users/1?tab=orders` | 維持父路由 handle | Tab 是頁面內的顯示偏好，URL 需記錄狀態 |
| **純 UI State** | URL 不變 | 維持父路由 handle | Tab 純屬前端顯示控制，不需要 URL 紀錄 |

---

### 模式一：靜態子路由（本專案實作）

每個 Tab 是獨立路由，handle 各自設定，`useMatches()` 決定 active tab。

```
適合：個人資料 / 購買紀錄 / 評論紀錄
→ 每個 Tab 資料來源不同、可獨立書籤、可直接分享連結給他人
```

---

### 模式二：Query Param Tab（URL 記錄但不換路由）

企業專案常見做法，同一路由下用 `?tab=xxx` 記錄 Tab 狀態。

```
/users/1?tab=profile   → 個人資料
/users/1?tab=orders    → 購買紀錄
/users/1?tab=reviews   → 評論紀錄
```

#### 問題：useMatches() 只看到父路由，每個 Tab 無法有獨立 handle.key

```
/users/1?tab=orders 時：
  useMatches() → [..., { handle: { key: 'users-detail' } }]  ← Tab 切換對路由完全透明
                                                               ← 永遠只有父路由的 key
```

#### 解法：tabConfig 獨立設定檔 + useActiveHandle hook

routerConfig 維持純路由 handle，Tab handle 另開 `tabConfig.ts` 管理，兩份設定職責分離。

```ts
// routerConfig.ts — 不變，純路由 handle
'USERS.DETAIL': {
  key: 'users-detail',
  title: '詳細資訊',
  description: '...',
  // ← 不混入 tabs，維持單一職責
},
```

```ts
// tabConfig.ts — 專責 Query Param Tab 的 handle 設定
// 頂層 key = 對應路由的 handle.key（作為查詢索引）
const tabConfig = {
  'users-detail': {
    defaultTab: 'profile',             // 未帶 ?tab= 時的預設 Tab
    tabs: {
      profile: { key: 'users-detail-profile', title: '個人資料', description: '...' },
      orders:  { key: 'users-detail-orders',  title: '購買紀錄', description: '...' },
      reviews: { key: 'users-detail-reviews', title: '評論紀錄', description: '...' },
    },
  },
} as const
```

#### useActiveHandle — 跨兩份 config 解析當前有效 handle

```js
// hooks/useActiveHandle.js
import tabConfig from '../tabConfig'

export function useActiveHandle() {
  const matches = useMatches()
  const [searchParams] = useSearchParams()

  const routeHandle = [...matches].reverse().find((m) => m.handle?.key)?.handle

  // 以路由 handle.key 查 tabConfig，確認此路由是否有 QP Tab 設定
  const tabConfigEntry = tabConfig[routeHandle?.key]
  if (tabConfigEntry) {
    const tabKey = searchParams.get('tab') ?? tabConfigEntry.defaultTab
    const tabHandle = tabConfigEntry.tabs[tabKey]
    if (tabHandle) return tabHandle
  }

  return routeHandle ?? null
}
```

```
/users/1               → useActiveHandle() = { key: 'users-detail', ... }
/users/1?tab=orders    → useActiveHandle() = { key: 'users-detail-orders', title: '購買紀錄', ... }
/users/1?tab=reviews   → useActiveHandle() = { key: 'users-detail-reviews', title: '評論紀錄', ... }
```

`PageContainer` 改用 `useActiveHandle()`，兩種 Tab 模式均能正確顯示各自 handle 的說明。

```jsx
// UserDetail.jsx — Query Param 版本
const [searchParams, setSearchParams] = useSearchParams()
const activeTab = searchParams.get('tab') ?? 'profile'

<Tabs
  activeKey={activeTab}
  onChange={(key) => setSearchParams({ tab: key })}
  items={[
    { key: 'profile', label: '個人資料', children: <UserProfile /> },
    { key: 'orders',  label: '購買紀錄', children: <UserOrders /> },
    { key: 'reviews', label: '評論紀錄', children: <UserReviews /> },
  ]}
/>
```

```
適合：後台管理系統的設定頁、Dashboard 的顯示切換
→ 同一份資料，只是呈現方式不同；重新整理後希望停留在同一個 Tab
```

---

### 模式三：純 UI State（URL 不記錄）

Tab 狀態完全由元件內部 `useState` 管理，URL 不變。

```jsx
const [activeTab, setActiveTab] = useState('profile')
```

```
適合：彈窗內的 Tab、側邊欄的切換、不需要書籤化的輔助資訊
→ Tab 只是 UI 的顯示控制，對業務邏輯無意義
```

---

### 決策流程

```
Tab 切換時，需要可以分享/書籤這個 Tab 的連結嗎？
│
├── 是 → 各 Tab 的資料來源是否完全獨立？
│        ├── 是 → 靜態子路由（useMatches handle.key）
│        └── 否 → Query Param（useSearchParams）
│
└── 否 → 純 UI State（useState）
```

---

## Tab 設計模式完整比較

### 四種模式一覽

| | ❌ 動態路由 `:info` | ✅ 靜態子路由 | ✅ Query Param + tabConfig | ✅ 純 UI State | ✅ 動態路由 + paramKey |
|---|---|---|---|---|---|
| **URL** | `/users/1/orders` | `/users/1/orders` | `/users/1?tab=orders` | `/users/1`（不變）| `/users/1/orders`（不動）|
| **路由數量** | 1 個（共用）| 每 Tab 各一個 | 1 個（父路由）| 1 個 | 1 個（不動）|
| **handle.key 區分 Tab** | ❌ 無法 | ✅ 各自獨立 | ✅ tabConfig 補足 | ❌ 無法 | ✅ tabConfig paramKey 補足 |
| **active Tab 判斷** | 元件 `params` if/switch | `useMatches()` 最深層 | `useSearchParams()` + tabConfig | `useState` | `useActiveHandle()` + tabConfig |
| **需改 router.jsx** | — | ✅ 需改 | 不需 | 不需 | **不需**（舊專案福音）|
| **書籤 / 分享** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **重新整理保留 Tab** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Breadcrumb 顯示 Tab** | ❌ | ✅ | ❌ | ❌ | ❌ |

---

### 模式一：❌ 動態路由 `:info`（反模式，不建議）

```
URL：/users/:id/:info
```

```jsx
// router.jsx
{ path: ':info', element: <UserDetail />, handle: routerConfig['USERS.DETAIL'] }
//                                                ↑ 三個 Tab 只有一個 handle，無法區分

// UserDetail.jsx — 元件被迫自己判斷
const { info } = useParams()
if (info === 'profile') return <Profile />
if (info === 'orders')  return <Orders />
// handle.key 永遠是 'users-detail'，PageContainer / Breadcrumb 看不出 Tab
```

**致命問題**：路由失去語意（`:info` 接受任意字串）、handle 無法各自設定、元件邏輯污染。

---

### 模式二：✅ 靜態子路由（本專案實作）

```
URL：/users/:id/profile  /users/:id/orders  /users/:id/reviews
設定：routerConfig（每個 Tab 各一筆）
判斷：useMatches() 最深層 handle.key = active Tab
```

```jsx
// router.jsx — 每個 Tab 獨立路由
{
  path: ':id',
  element: <UserDetail />,
  handle: routerConfig['USERS.DETAIL'],
  children: [
    { index: true,    element: <UserProfile />, handle: routerConfig['USERS.DETAIL.PROFILE'] },
    { path: 'orders', element: <UserOrders />,  handle: routerConfig['USERS.DETAIL.ORDERS'] },
  ],
}

// UserDetail.jsx — 元件零判斷
const activeKey = [...useMatches()].reverse().find(m => m.handle?.key)?.handle?.key
<Tabs activeKey={activeKey} onChange={key => navigate(key)} />
<Outlet />
```

**最適合**：各 Tab 資料來源不同、需要書籤化、需要 Breadcrumb 顯示到 Tab 層級。

---

### 模式三：✅ Query Param + tabConfig（同一路由，URL 記錄 Tab）

```
URL：/users/:id?tab=orders
設定：routerConfig（父路由一筆）+ tabConfig（Tab handle 群組）
判斷：useActiveHandle() = useMatches() + useSearchParams() + tabConfig 查詢
```

```ts
// tabConfig.ts — Tab handle 獨立管理，不污染 routerConfig
const tabConfig = {
  'users-detail': {          // ← 以路由 handle.key 為索引
    defaultTab: 'profile',
    tabs: {
      profile: { key: 'users-detail-profile', title: '個人資料', description: '...' },
      orders:  { key: 'users-detail-orders',  title: '購買紀錄', description: '...' },
    },
  },
} as const
```

```jsx
// UserDetail.jsx
const [searchParams, setSearchParams] = useSearchParams()
const activeTab = searchParams.get('tab') ?? 'profile'
<Tabs activeKey={activeTab} onChange={key => setSearchParams({ tab: key })} />

// PageContainer 透過 useActiveHandle() 自動取得正確 Tab handle
// /users/1?tab=orders → handle = { key: 'users-detail-orders', title: '購買紀錄' }
```

**最適合**：同一份資料不同呈現方式、企業後台設定頁、Dashboard、希望保留 Tab 狀態但不需要 Breadcrumb 細分。

---

### 模式四：✅ 純 UI State（URL 不記錄）

```
URL：/users/:id（不變）
設定：無，handle 維持父路由
判斷：useState
```

```jsx
// UserDetail.jsx
const [activeTab, setActiveTab] = useState('profile')

const TAB_CONTENT = {
  profile: <UserProfile />,
  orders:  <UserOrders />,
  reviews: <UserReviews />,
}

<Tabs activeKey={activeTab} onChange={setActiveTab} />
{TAB_CONTENT[activeTab]}
// handle.key 永遠是 'users-detail'，PageContainer 顯示的是整頁說明
```

**最適合**：彈窗內的 Tab、側邊欄輔助資訊、純前端顯示控制、不需要任何 URL 記錄。

---

### 模式五：✅ 動態路由 + tabConfig paramKey（舊專案改造，不動 router）

**情境**：舊專案已有大量 `path: ':info'` 動態路由，URL 不能改、router.jsx 不想動，但希望 `useMatches()` 能區分各 Tab 的 handle.key。

**核心問題**：

```
// 舊 router.jsx（不動它）
{ path: ':info', element: <UserDetail />, handle: { key: 'legacy-user-detail' } }

// useMatches() 在 /users/1/orders 時：
// { handle: { key: 'legacy-user-detail' }, params: { id: '1', info: 'orders' } }
//                ↑ handle 靜態，看不出 Tab                ↑ 但 params 有值！
```

`useMatches()` 的 `handle.key` 永遠相同，但 `params.info` 已包含 Tab 資訊，只是沒有被利用。

**解法**：在 `tabConfig` 加 `paramKey`，告訴 `useActiveHandle` 從哪個 param 讀 Tab key：

```ts
// tabConfig.ts — 只加這一筆，不改 router.jsx
const tabConfig = {
  'legacy-user-detail': {
    paramKey: 'info',      // ← 從 match.params['info'] 取 Tab key
    defaultTab: 'profile',
    tabs: {
      profile: { key: 'legacy-user-detail-profile', title: '個人資料', description: '...' },
      orders:  { key: 'legacy-user-detail-orders',  title: '購買紀錄', description: '...' },
      reviews: { key: 'legacy-user-detail-reviews', title: '評論紀錄', description: '...' },
    },
  },
} as const
```

```js
// useActiveHandle.js — paramKey 分支
const tabKey = tabConfigEntry.paramKey
  ? currentMatch.params[tabConfigEntry.paramKey]  // 動態路由：從 params 取
  : searchParams.get('tab')                        // Query Param：從 searchParams 取
```

**改造前後對比**：

```
改造前（只有 router.jsx）
  /users/1/profile → useMatches key = 'legacy-user-detail'  ❌ 無法區分
  /users/1/orders  → useMatches key = 'legacy-user-detail'  ❌ 無法區分

改造後（加 tabConfig paramKey，router.jsx 不動）
  /users/1/profile → useActiveHandle key = 'legacy-user-detail-profile'  ✅
  /users/1/orders  → useActiveHandle key = 'legacy-user-detail-orders'   ✅
  /users/1/reviews → useActiveHandle key = 'legacy-user-detail-reviews'  ✅
```

**改造成本**：只需在 `tabConfig.ts` 新增一筆設定，無需修改 router.jsx 或任何頁面元件。

---

### handle.key 在各模式的能見度

```
模式               PageContainer      Breadcrumb         useMatches 深度
─────────────────  ────────────────   ────────────────   ──────────────────
靜態子路由          ✅ Tab 獨立 key    ✅ 顯示到 Tab       ROOT > USERS > USERS.DETAIL > USERS.DETAIL.ORDERS
Query Param         ✅ Tab 獨立 key    ❌ 只到父路由        ROOT > USERS > USERS.DETAIL
  (useActiveHandle) (tabConfig 補足)
純 UI State         ❌ 只有父路由 key  ❌ 只到父路由        ROOT > USERS > USERS.DETAIL
動態 :info          ❌ 只有父路由 key  ❌ 路由無法區分      ROOT > USERS > USERS.DETAIL（不變）
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
├── routerConfig.ts          # 路由 handle 設定（as const，每個路由物件一個 handle）
├── tabConfig.ts             # Query Param Tab handle 設定（以路由 handle.key 為索引）
├── router.jsx               # 路由結構定義（path 層級 + handle 掛載）
├── main.jsx                 # RouterProvider 入口
├── hooks/
│   └── useActiveHandle.js   # useMatches + useSearchParams → 解析當前有效 handle
├── layouts/
│   ├── RootLayout.jsx       # 全域 Layout（Navbar、debug bar、Breadcrumb、PageContainer）
│   ├── UsersLayout.jsx      # /users 巢狀 Layout
│   └── ProductsLayout.jsx   # /products 巢狀 Layout
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── UsersList.jsx
│   ├── UserDetail.jsx           # Tab layout（useMatches activeKey）
│   ├── UserProfile.jsx          # Tab：個人資料
│   ├── UserOrders.jsx           # Tab：購買紀錄
│   ├── UserReviews.jsx          # Tab：評論紀錄
│   ├── ProductsList.jsx
│   └── ProductCategory.jsx
└── components/
    ├── PageContainer.jsx    # 全域頁面容器（handle.key 標示 + FloatButton Popover）
    └── Breadcrumb.jsx       # 麵包屑導航（useMatches → handle.title → Link）
```
