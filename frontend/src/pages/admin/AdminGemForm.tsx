import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import type { Category, GemDetail } from '../../services/api'

const emptyForm = {
  code: '', name: '', description: '', categoryId: 0, weightCarats: 0, origin: 'Ceylon',
  shape: '', cut: '', treatment: '', color: '', certificateNumber: '', certificateAuthority: '',
  price: 0, status: 'Available', isFeatured: false,
}

export default function AdminGemForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [gemId, setGemId] = useState<number | null>(isEdit ? Number(id) : null)
  const [images, setImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { api.get<Category[]>('/categories').then((r) => setCategories(r.data)) }, [])

  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/gems`).then((r) => {
      const gem = r.data.items.find((g: any) => g.id === Number(id))
      if (gem) api.get<GemDetail>(`/gems/${gem.slug}`).then((res) => {
        setForm({ ...res.data, certificateNumber: res.data.certificateNumber ?? '', certificateAuthority: res.data.certificateAuthority ?? '' })
        setImages(res.data.imageUrls)
      })
    })
  }, [id, isEdit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/admin/gems/${id}`, form)
        navigate('/admin/gems')
      } else {
        const { data } = await api.post('/admin/gems', form)
        setGemId(data.id)
        navigate(`/admin/gems/${data.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!gemId || !e.target.files?.[0]) return
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('isPrimary', String(images.length === 0))
    const { data } = await api.post(`/admin/gems/${gemId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    setImages([...images, data.url])
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">{isEdit ? 'Edit Gem' : 'Add Gem'}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-w-3xl">
        <input required placeholder="Code (e.g. CGH-1010)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} className="bg-white/5 border border-ivory/20 px-3 py-2">
          <option value={0}>Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input required type="number" step="0.01" placeholder="Weight (carats)" value={form.weightCarats} onChange={(e) => setForm({ ...form, weightCarats: Number(e.target.value) })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input placeholder="Shape" value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input placeholder="Cut" value={form.cut} onChange={(e) => setForm({ ...form, cut: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input placeholder="Treatment" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input placeholder="Certificate Authority (e.g. GIA)" value={form.certificateAuthority} onChange={(e) => setForm({ ...form, certificateAuthority: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input placeholder="Certificate Number" value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <input required type="number" step="0.01" placeholder="Price (USD)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="bg-white/5 border border-ivory/20 px-3 py-2" />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-white/5 border border-ivory/20 px-3 py-2">
          <option value="Available">Available</option>
          <option value="Pending">Pending</option>
          <option value="Sold">Sold</option>
        </select>
        <label className="flex items-center gap-2 col-span-2 text-sm text-ivory/70">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          Feature this gem on the homepage
        </label>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-2 bg-white/5 border border-ivory/20 px-3 py-2 h-28" />

        <button disabled={saving} className="col-span-2 facet-btn bg-gold text-charcoal py-3 uppercase text-sm tracking-wide mt-2">
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Gem'}
        </button>
      </form>

      {gemId && (
        <div className="mt-10 max-w-3xl">
          <h2 className="font-display text-xl mb-4">Photos</h2>
          <div className="flex gap-4 flex-wrap mb-4">
            {images.map((url, i) => (
              <img key={i} src={url} className="w-24 h-24 object-cover facet-card border border-gold/15" />
            ))}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm text-ivory/60" />
          <p className="text-ivory/40 text-xs mt-2">Upload at least one photo. The first uploaded photo becomes the primary listing image.</p>
        </div>
      )}
    </div>
  )
}
