import { Link } from 'react-router-dom'

export default function UsersList() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((id) => (
          <Link
            key={id}
            to={`/users/${id}`}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-gray-700"
          >
            User {id}
          </Link>
        ))}
      </div>
    </div>
  )
}
