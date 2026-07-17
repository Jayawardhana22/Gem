import { useEffect, useState } from 'react'
import { api } from '../../services/api'

interface AdminOrder {
  id: number
  orderNumber: string
  total: number
  status: string
  createdAt: string
  customerName: string
  customerEmail: string
  itemCount: number
}

const statuses = ['PendingPayment', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    api.get('/admin/orders').then((r) => setOrders(r.data.items)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: number, status: string) {
    await api.put(`/admin/orders/${id}/status`, JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } })
    load()
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>
      {loading ? <p className="text-ivory/40">Loading…</p> : (
        <table className="w-full text-sm">
          <thead className="text-ivory/40 uppercase text-xs text-left">
            <tr><th className="py-2">Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="py-3">{o.orderNumber}</td>
                <td>{o.customerName}<br /><span className="text-ivory/40 text-xs">{o.customerEmail}</span></td>
                <td>{o.itemCount}</td>
                <td className="text-gold">${o.total.toLocaleString()}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="bg-white/5 border border-ivory/20 px-2 py-1 text-xs">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
