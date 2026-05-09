import { Outlet, NavLink } from 'react-router-dom'

export default function UsersLayout() {
  return (
    <div className="flex gap-6">
      <aside className="w-40 shrink-0">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Users</p>
        <nav className="flex flex-col gap-1">
          {[1, 2, 3].map((id) => (
            <NavLink
              key={id}
              to={`/users/${id}`}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              User {id}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
