import { useEffect, useState } from 'react'
import { api } from '../../services/api'

interface DashboardData {
  totalGems: number
  available: number
  sold: number
  totalRevenue: number
  pendingOrders: number
  recentOrders: { id: number; orderNumber: string; total: number; status: string; createdAt: string }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data)) }, [])

  if (!data) return <p className="text-ivory/40">Loading dashboard…</p>

  const stats = [
    { label: 'Total Gems', value: data.totalGems },
    { label: 'Available', value: data.available },
    { label: 'Sold', value: data.sold },
    { label: 'Revenue', value: `$${data.totalRevenue.toLocaleString()}` },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="facet-card border border-gold/15 p-5">
            <p className="text-ivory/40 text-xs uppercase tracking-wide">{s.label}</p>
            <p className="font-display text-2xl text-gold mt-2">{s.value}</p>
          </div>
        ))}
      </div>
      <h2 className="font-display text-xl mb-4">Recent Orders</h2>
      <div className="border border-gold/15 divide-y divide-gold/10">
        {data.recentOrders.map((o) => (
          <div key={o.id} className="flex justify-between px-4 py-3 text-sm">
            <span>{o.orderNumber}</span>
            <span className="text-ivory/50">{o.status}</span>
            <span className="text-gold">${o.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
