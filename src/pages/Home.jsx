import { useNavigateByKey } from '../hooks/useNavigateByKey'

const DEMO_LINKS = [
  { key: 'about',                label: '關於頁面',                params: {} },
  { key: 'users-list',           label: 'Users 列表',              params: {} },
  { key: 'users-detail',         label: 'User 1 詳細頁',           params: { id: '1' } },
  { key: 'users-detail-orders',  label: 'User 2 購買紀錄 Tab',     params: { id: '2' } },
  { key: 'users-detail-reviews', label: 'User 3 評論紀錄 Tab',     params: { id: '3' } },
  { key: 'products-category',    label: 'Electronics 分類',        params: { category: 'electronics' } },
]

export default function Home() {
  const navigateByKey = useNavigateByKey()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Home</h1>
      <p className="text-gray-400 text-sm mb-6">useNavigateByKey 跨層導航範例</p>

      <div className="flex flex-col gap-2">
        {DEMO_LINKS.map(({ key, label, params }) => (
          <button
            key={key}
            onClick={() => navigateByKey(key, params)}
            className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left"
          >
            <span className="text-gray-700">{label}</span>
            <code className="text-xs text-indigo-500 font-mono">{key}</code>
          </button>
        ))}
      </div>
    </div>
  )
}
