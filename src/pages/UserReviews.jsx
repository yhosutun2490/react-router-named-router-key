import { useParams } from 'react-router-dom'

const MOCK_REVIEWS = [
  { id: 1, product: '藍牙耳機', rating: 5, comment: '音質很好，推薦！' },
  { id: 2, product: '機械鍵盤', rating: 4, comment: '手感不錯，有點重。' },
  { id: 3, product: '滑鼠墊',   rating: 3, comment: '普通，符合期待。' },
]

export default function UserReviews() {
  const { id } = useParams()

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-3">User {id} 的評論紀錄</p>
      {MOCK_REVIEWS.map((review) => (
        <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-700">{review.product}</p>
            <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
          </div>
          <p className="text-xs text-gray-500">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
