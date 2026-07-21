import { Link } from 'react-router-dom'
import type { GemListItem } from '../services/api'

interface GemCardProps {
  gem: GemListItem
}

export default function GemCard({ gem }: GemCardProps) {
  return (
    <Link
      to={`/shop/${gem.slug}`}
      className="facet-card border border-gold/15 p-4 transition hover:border-gold/50 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 mb-4">
        {gem.primaryImageUrl ? (
          <img src={gem.primaryImageUrl} alt={gem.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 text-ivory/50">
            No image
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-sm text-ivory/50 uppercase tracking-[0.3em]">{gem.categoryName}</p>
        <h3 className="font-display text-xl mt-2">{gem.name}</h3>
      </div>

      <div className="flex items-center justify-between text-sm text-ivory/70">
        <span>{gem.weightCarats.toFixed(2)} ct</span>
        <span className="font-semibold text-gold">${gem.price.toFixed(2)}</span>
      </div>
    </Link>
  )
}
