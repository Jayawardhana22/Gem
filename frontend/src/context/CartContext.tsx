import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { api } from '../services/api'
import type { CartSummary } from '../services/api'

interface CartContextType {
  cart: CartSummary | null
  itemCount: number
  refreshCart: () => Promise<void>
  addToCart: (gemId: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null)

  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('gem_token')
    if (!token) { setCart(null); return }
    try {
      const { data } = await api.get<CartSummary>('/cart')
      setCart(data)
    } catch {
      setCart(null)
    }
  }, [])

  async function addToCart(gemId: number) {
    await api.post('/cart', { gemId, quantity: 1 })
    await refreshCart()
  }

  async function removeFromCart(cartItemId: number) {
    await api.delete(`/cart/${cartItemId}`)
    await refreshCart()
  }

  const itemCount = cart?.items.length ?? 0

  return (
    <CartContext.Provider value={{ cart, itemCount, refreshCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
