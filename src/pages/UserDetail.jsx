import { useParams } from 'react-router-dom'

export default function UserDetail() {
  const { id } = useParams()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">User {id}</h2>
      <p className="text-gray-500">
        動態路由參數 <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">:id = {id}</code>
      </p>
    </div>
  )
}
