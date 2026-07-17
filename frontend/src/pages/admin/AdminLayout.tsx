import { NavLink, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-sm uppercase tracking-wide ${isActive ? 'bg-gold/10 text-gold border-l-2 border-gold' : 'text-ivory/60 hover:text-ivory'}`

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-[220px_1fr] gap-8">
      <aside className="border border-gold/15">
        <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/admin/gems" className={linkClass}>Gems</NavLink>
        <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
      </aside>
      <main><Outlet /></main>
    </div>
  )
}
