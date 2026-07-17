import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import type { GemListItem, Category } from '../services/api'
import Hero3DGem from '../components/Hero3DGem'
import GemCard from '../components/GemCard'

export default function Home() {
  const [featured, setFeatured] = useState<GemListItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api.get('/gems', { params: { featuredOnly: true, pageSize: 4 } }).then((r) => setFeatured(r.data.items))
    api.get<Category[]>('/categories').then((r) => setCategories(r.data))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-8 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold mb-4">Certified Ceylon Gemstones</p>
          <h1 className="font-display text-5xl md:text-6xl leading-tight">
            Every stone <span className="text-gold">cut</span> by light,
            <br />sold with <span className="text-sapphire">trust</span>.
          </h1>
          <p className="text-ivory/60 mt-6 max-w-md">
            Sourced directly from the gem pits of Ratnapura and the trading floors of Beruwala,
            each gem on this atelier is certified, photographed, and shipped insured to your door.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/shop" className="facet-btn bg-gold text-charcoal px-6 py-3 font-medium uppercase tracking-wide text-sm hover:bg-gold/90">
              Browse the Collection
            </Link>
            <Link to="/shop?featured=true" className="facet-btn border border-ivory/30 px-6 py-3 font-medium uppercase tracking-wide text-sm hover:border-ivory">
              View Featured
            </Link>
          </div>
        </div>
        <Hero3DGem />
      </section>

      <div className="facet-divider max-w-7xl mx-auto" />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl mb-8">Shop by Gem</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.slug}`} className="facet-card border border-gold/15 hover:border-gold/50 p-5 transition-colors">
              <p className="font-display text-lg">{c.name}</p>
              <p className="text-ivory/40 text-xs mt-1 font-mono">{c.gemCount} in stock</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl">Featured Gems</h2>
            <Link to="/shop?featured=true" className="text-sm text-gold hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((g) => <GemCard key={g.id} gem={g} />)}
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="bg-white/[0.02] border-y border-gold/10 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div><p className="font-display text-3xl text-gold">100%</p><p className="text-ivory/60 text-sm mt-1">Certified Authenticity</p></div>
          <div><p className="font-display text-3xl text-gold">Insured</p><p className="text-ivory/60 text-sm mt-1">Worldwide Shipping</p></div>
          <div><p className="font-display text-3xl text-gold">Direct</p><p className="text-ivory/60 text-sm mt-1">From Ceylon's Gem Pits</p></div>
        </div>
      </section>
    </div>
  )
}
