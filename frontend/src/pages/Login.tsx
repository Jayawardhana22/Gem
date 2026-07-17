import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2">Welcome back</h1>
      <p className="text-ivory/50 mb-8">Sign in to manage your orders and saved gems.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-ivory/20 px-4 py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-ivory/20 px-4 py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
        {error && <p className="text-ruby text-sm">{error}</p>}
        <button disabled={loading} className="facet-btn w-full bg-gold text-charcoal py-3 font-medium uppercase tracking-wide hover:bg-gold/90">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="text-ivory/50 text-sm mt-6">No account yet? <Link to="/register" className="text-gold hover:underline">Register</Link></p>
    </div>
  )
}
