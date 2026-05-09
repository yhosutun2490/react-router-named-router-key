import { Link } from 'react-router-dom'

const CATEGORIES = ['electronics', 'clothing', 'books']

export default function ProductsList() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">所有產品分類</h2>
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={`/products/${cat}`}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-center text-gray-700 capitalize"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  )
}
