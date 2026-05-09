import { useParams } from 'react-router-dom'

const MOCK_ORDERS = [
  { id: 'ORD-001', date: '2024-03-01', amount: 'NT$1,200', status: '已完成' },
  { id: 'ORD-002', date: '2024-03-15', amount: 'NT$450',   status: '已完成' },
  { id: 'ORD-003', date: '2024-04-02', amount: 'NT$3,800', status: '處理中' },
]

export default function UserOrders() {
  const { id } = useParams()

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">User {id} 的購買紀錄</p>
      {MOCK_ORDERS.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-700">{order.id}</p>
            <p className="text-xs text-gray-400">{order.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{order.amount}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              order.status === '已完成'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
