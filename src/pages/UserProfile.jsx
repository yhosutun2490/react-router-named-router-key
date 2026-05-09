import { useParams } from 'react-router-dom'

export default function UserProfile() {
  const { id } = useParams()

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '使用者 ID', value: id },
          { label: '姓名', value: `User ${id}` },
          { label: '信箱', value: `user${id}@example.com` },
          { label: '註冊日期', value: '2024-01-01' },
        ].map(({ label, value }) => (
          <div key={label} className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm text-gray-700 font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
