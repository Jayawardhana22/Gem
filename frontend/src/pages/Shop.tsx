import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../services/api'
import type { GemListItem, Category } from '../services/api'
import GemCard from '../components/GemCard'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [gems, setGems] = useState<GemListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const category = params.get('category') || ''
  const featured = params.get('featured') === 'true'
  const sort = params.get('sort') || ''
  const search = params.get('search') || ''

  useEffect(() => {
    api.get<Category[]>('/categories').then((r) => setCategories(r.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get('/gems', { params: { category: category || undefined, featuredOnly: featured || undefined, sort: sort || undefined, search: search || undefined, pageSize: 24 } })
      .then((r) => { setGems(r.data.items); setTotal(r.data.total) })
      .finally(() => setLoading(false))
  }, [category, featured, sort, search])

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-2">{featured ? 'Featured Gems' : 'The Collection'}</h1>
      <p className="text-ivory/50 mb-8">{total} gem{total !== 1 ? 's' : ''} available</p>

      <div className="flex flex-wrap gap-3 mb-10">
        <button onClick={() => updateParam('category', '')} className={`facet-btn px-4 py-2 text-xs uppercase tracking-wide border ${!category ? 'bg-gold text-charcoal border-gold' : 'border-ivory/20 text-ivory/70'}`}>All</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => updateParam('category', c.slug)}
            className={`facet-btn px-4 py-2 text-xs uppercase tracking-wide border ${category === c.slug ? 'bg-gold text-charcoal border-gold' : 'border-ivory/20 text-ivory/70'}`}>
            {c.name}
          </button>
        ))}
        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}
          className="ml-auto bg-white/5 border border-ivory/20 text-ivory text-xs px-3 py-2 facet-btn">
          <option value="">Sort: Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="carat_desc">Carat: Largest First</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {loading ? (
        <p className="text-ivory/40">Loading gems…</p>
      ) : gems.length === 0 ? (
        <p className="text-ivory/40">No gems match these filters yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {gems.map((g) => <GemCard key={g.id} gem={g} />)}
        </div>
      )}
    </div>
  )
}
