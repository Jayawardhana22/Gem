import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

function PaymentForm({ orderId }: { orderId: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { refreshCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/orders` },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setSubmitting(false)
      return
    }

    await refreshCart()
    navigate(`/orders`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-ruby text-sm">{error}</p>}
      <button disabled={!stripe || submitting} className="facet-btn w-full bg-gold text-charcoal py-4 font-medium uppercase tracking-wide hover:bg-gold/90 disabled:opacity-50">
        {submitting ? 'Processing…' : `Pay & Confirm Order #${orderId}`}
      </button>
    </form>
  )
}

export default function Checkout() {
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [form, setForm] = useState({
    shippingName: '', shippingAddress: '', shippingCity: '', shippingCountry: '', shippingPostalCode: '', contactPhone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data: order } = await api.post('/orders', { shipping: form })
      const { data: intent } = await api.post(`/payments/create-intent/${order.id}`)
      setClientSecret(intent.clientSecret)
      setOrderId(order.id)
      setStep('payment')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>

      {step === 'shipping' && (
        <form onSubmit={handleCreateOrder} className="space-y-4">
          {(['shippingName', 'shippingAddress', 'shippingCity', 'shippingCountry', 'shippingPostalCode', 'contactPhone'] as const).map((field) => (
            <input
              key={field}
              required
              placeholder={field.replace('shipping', '').replace(/([A-Z])/g, ' $1').trim() || 'Contact Phone'}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full bg-white/5 border border-ivory/20 px-4 py-3 text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-gold"
            />
          ))}
          {error && <p className="text-ruby text-sm">{error}</p>}
          <button disabled={loading} className="facet-btn w-full bg-gold text-charcoal py-4 font-medium uppercase tracking-wide hover:bg-gold/90 disabled:opacity-50">
            {loading ? 'Preparing payment…' : 'Continue to Payment'}
          </button>
        </form>
      )}

      {step === 'payment' && clientSecret && orderId && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#C7A35C' } } }}>
          <PaymentForm orderId={orderId} />
        </Elements>
      )}
    </div>
  )
}
