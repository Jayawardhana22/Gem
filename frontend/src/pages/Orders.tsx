import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Order } from '../services/api'

const statusColor: Record<string, string> = {
  PendingPayment: 'text-ivory/50',
  Paid: 'text-gold',
  Processing: 'text-sapphire',
  Shipped: 'text-sapphire',
  Delivered: 'text-green-400',
  Cancelled: 'text-ruby',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Order[]>('/orders').then((r) => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-16 text-ivory/40">Loading orders…</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-ivory/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o.id} className="facet-card border border-gold/15 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-display text-lg">{o.orderNumber}</p>
                  <p className="text-ivory/40 text-xs">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs uppercase tracking-wide ${statusColor[o.status] ?? ''}`}>{o.status}</span>
              </div>
              <ul className="text-sm text-ivory/70 space-y-1 mb-4">
                {o.items.map((i) => (
                  <li key={i.gemId}>{i.gemName} ({i.gemCode}) × {i.quantity} — ${i.lineTotal.toLocaleString()}</li>
                ))}
              </ul>
              <div className="facet-divider mb-4" />
              <div className="flex justify-between text-sm">
                <span className="text-ivory/50">Subtotal ${o.subtotal.toLocaleString()} + Shipping ${o.shippingFee.toLocaleString()}</span>
                <span className="font-display text-lg text-gold">${o.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
