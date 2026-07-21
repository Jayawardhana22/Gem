import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(fullName, email, password, country)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2">Create your account</h1>
      <p className="text-ivory/50 mb-8">Join collectors buying directly from Ceylon's gem trade.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-white/5 border border-ivory/20 px-4 py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-ivory/20 px-4 py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
        <input required placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)}
          className="w-full bg-white/5 border border-ivory/20 px-4 py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
        <input required type="password" minLength={12} placeholder="Password (min 12 characters)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-ivory/20 px-4 py-3 placeholder:text-ivory/30 focus:outline-none focus:border-gold" />
        <p className="text-ivory/60 text-xs">Password must be at least 12 characters and include upper/lower case letters, numbers, and a symbol.</p>
        {error && <p className="text-ruby text-sm">{error}</p>}
        <button disabled={loading} className="facet-btn w-full bg-gold text-charcoal py-3 font-medium uppercase tracking-wide hover:bg-gold/90">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
      <p className="text-ivory/50 text-sm mt-6">Already have an account? <Link to="/login" className="text-gold hover:underline">Sign in</Link></p>
    </div>
  )
}
