import { NavLink, Outlet, useMatches } from 'react-router-dom'
import PageContainer from '../components/PageContainer'

export default function RootLayout() {
  const matches = useMatches()

  const matchedKeys = matches
    .filter((m) => m.handle?.key)
    .map((m) => m.handle.key)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex gap-6 items-center">
          <span className="font-bold text-gray-800 text-lg">RouterTest</span>
          <div className="flex gap-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                }`
              }
            >
              Users
            </NavLink>
          </div>
        </div>
      </nav>

      {/* useMatches — 完整 key 鏈（所有已 match 的路由） */}
      <div className="bg-gray-900 font-mono text-xs px-6 py-2 flex items-center gap-2">
        <span className="text-gray-500">useMatches keys:</span>
        <div className="flex items-center gap-1">
          {matchedKeys.map((key, i) => (
            <span key={key} className="flex items-center gap-1">
              <span className="px-2 py-0.5 bg-gray-700 text-green-400 rounded">{key}</span>
              {i < matchedKeys.length - 1 && <span className="text-gray-600">›</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Page content — PageContainer 全域包一次，所有子頁面自動生效 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  )
}
