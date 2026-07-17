import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import type { GemListItem } from '../../services/api'

export default function AdminGems() {
  const [gems, setGems] = useState<GemListItem[]>([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    api.get('/admin/gems').then((r) => setGems(r.data.items)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm('Delete this gem listing permanently?')) return
    await api.delete(`/admin/gems/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Gems</h1>
        <Link to="/admin/gems/new" className="facet-btn bg-gold text-charcoal px-4 py-2 text-sm uppercase tracking-wide">+ Add Gem</Link>
      </div>

      {loading ? <p className="text-ivory/40">Loading…</p> : (
        <table className="w-full text-sm">
          <thead className="text-ivory/40 uppercase text-xs text-left">
            <tr><th className="py-2">Code</th><th>Name</th><th>Category</th><th>Carat</th><th>Price</th><th>Status</th><th></th></tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {gems.map((g) => (
              <tr key={g.id}>
                <td className="py-3 font-mono text-gold/80">{g.code}</td>
                <td>{g.name}</td>
                <td>{g.categoryName}</td>
                <td>{g.weightCarats} ct</td>
                <td className="text-gold">${g.price.toLocaleString()}</td>
                <td>{g.status}</td>
                <td className="text-right">
                  <Link to={`/admin/gems/${g.id}`} className="text-sapphire hover:underline mr-4">Edit</Link>
                  <button onClick={() => handleDelete(g.id)} className="text-ruby hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
