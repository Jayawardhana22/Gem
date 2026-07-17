import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide uppercase transition-colors ${isActive ? 'text-gold' : 'text-ivory/70 hover:text-ivory'}`

  return (
    <header className="sticky top-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-widest">
          CEYLON <span className="text-gold">GEM</span> ATELIER
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/shop?featured=true" className={linkClass}>Featured</NavLink>
          {user && <NavLink to="/orders" className={linkClass}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-5">
          <Link to="/cart" className="relative text-sm uppercase tracking-wide text-ivory/80 hover:text-ivory">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-ruby text-ivory text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={logout} className="text-sm uppercase tracking-wide text-ivory/70 hover:text-ivory">
              Sign out
            </button>
          ) : (
            <Link to="/login" className="facet-btn bg-gold text-charcoal px-4 py-2 text-sm font-medium uppercase tracking-wide hover:bg-gold/90">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
