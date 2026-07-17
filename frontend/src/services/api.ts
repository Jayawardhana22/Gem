import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api'

export const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gem_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export interface GemListItem {
  id: number
  code: string
  name: string
  slug: string
  price: number
  weightCarats: number
  color: string
  shape: string
  status: 'Available' | 'Pending' | 'Sold'
  isFeatured: boolean
  primaryImageUrl: string | null
  categoryName: string
}

export interface GemDetail extends Omit<GemListItem, 'primaryImageUrl'> {
  description: string
  origin: string
  cut: string
  treatment: string
  certificateNumber?: string
  certificateAuthority?: string
  categoryId: number
  imageUrls: string[]
}

export interface Category {
  id: number
  name: string
  slug: string
  iconImageUrl: string | null
  gemCount: number
}

export interface CartItem {
  id: number
  gemId: number
  gemName: string
  gemCode: string
  imageUrl: string | null
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
}

export interface OrderItem {
  gemId: number
  gemName: string
  gemCode: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Order {
  id: number
  orderNumber: string
  subtotal: number
  shippingFee: number
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}
