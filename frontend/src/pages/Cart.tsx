import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { cart, refreshCart, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { refreshCart() }, [refreshCart])

  if (!user) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <p className="text-ivory/60">Sign in to view your cart.</p>
      <Link to="/login" className="text-gold hover:underline">Sign in →</Link>
    </div>
  }

  if (!cart || cart.items.length === 0) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <p className="text-ivory/60 mb-4">Your cart is empty.</p>
      <Link to="/shop" className="facet-btn inline-block bg-gold text-charcoal px-6 py-3 uppercase text-sm tracking-wide">Browse Gems</Link>
    </div>
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="facet-card flex items-center gap-4 border border-gold/15 p-4">
            <div className="w-20 h-20 bg-white/5 flex-shrink-0 overflow-hidden">
              {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-mono text-xs text-gold/70">{item.gemCode}</p>
              <p className="font-display text-lg">{item.gemName}</p>
            </div>
            <p className="text-gold text-lg">${item.lineTotal.toLocaleString()}</p>
            <button onClick={() => removeFromCart(item.id)} className="text-ivory/40 hover:text-ruby text-sm uppercase tracking-wide">Remove</button>
          </div>
        ))}
      </div>

      <div className="facet-divider my-8" />

      <div className="flex justify-between items-center">
        <span className="text-ivory/60">Subtotal</span>
        <span className="font-display text-2xl text-gold">${cart.subtotal.toLocaleString()}</span>
      </div>
      <p className="text-ivory/40 text-xs mt-2">Insured international shipping (flat $150) calculated at checkout.</p>

      <button onClick={() => navigate('/checkout')} className="facet-btn w-full mt-8 bg-gold text-charcoal py-4 font-medium uppercase tracking-wide hover:bg-gold/90">
        Proceed to Checkout
      </button>
    </div>
  )
}
