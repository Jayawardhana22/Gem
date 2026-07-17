import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import type { GemDetail } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function GemDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [gem, setGem] = useState<GemDetail | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    api.get<GemDetail>(`/gems/${slug}`).then((r) => setGem(r.data))
  }, [slug])

  if (!gem) return <div className="max-w-7xl mx-auto px-6 py-16 text-ivory/40">Loading…</div>

  async function handleAddToCart() {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await addToCart(gem!.id)
      navigate('/cart')
    } finally {
      setAdding(false)
    }
  }

  const specs: [string, string][] = [
    ['Weight', `${gem.weightCarats} ct`],
    ['Origin', gem.origin],
    ['Shape', gem.shape],
    ['Cut', gem.cut],
    ['Treatment', gem.treatment],
    ['Color', gem.color],
  ]
  if (gem.certificateNumber) specs.push(['Certificate', `${gem.certificateAuthority ?? ''} ${gem.certificateNumber}`])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div>
        <div className="facet-card aspect-square bg-white/[0.03] border border-gold/15 overflow-hidden mb-4">
          {gem.imageUrls[activeImage] ? (
            <img src={gem.imageUrls[activeImage]} alt={gem.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ivory/30 font-mono text-xs">No image</div>
          )}
        </div>
        {gem.imageUrls.length > 1 && (
          <div className="flex gap-3">
            {gem.imageUrls.map((url, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`w-16 h-16 facet-card overflow-hidden border ${i === activeImage ? 'border-gold' : 'border-ivory/15'}`}>
                <img src={url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-gold">{gem.code} · {gem.categoryName}</p>
        <h1 className="font-display text-4xl mt-2">{gem.name}</h1>
        <p className="text-3xl text-gold mt-4">${gem.price.toLocaleString()}</p>
        <p className="text-ivory/60 mt-6 leading-relaxed">{gem.description}</p>

        <div className="facet-divider my-8" />

        <dl className="grid grid-cols-2 gap-y-4 text-sm">
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt className="text-ivory/40 uppercase text-xs tracking-wide">{label}</dt>
              <dd className="mt-1">{value}</dd>
            </div>
          ))}
        </dl>

        <button
          disabled={gem.status !== 'Available' || adding}
          onClick={handleAddToCart}
          className="facet-btn w-full mt-10 bg-gold text-charcoal py-4 font-medium uppercase tracking-wide hover:bg-gold/90 disabled:bg-ivory/10 disabled:text-ivory/40"
        >
          {gem.status !== 'Available' ? gem.status : adding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
