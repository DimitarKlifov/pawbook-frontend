import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { getServices, createService, updateService, addPricing, deleteService } from '../../lib/api/services'
import ConfirmDialog from '../ui/ConfirmDialog'
import { SkeletonGrid } from '../ui/Skeleton'
import { useToast } from '../../context/ToastContext'

const DOG_SIZES = ['SMALL', 'MEDIUM', 'LARGE']

function PricingForm({ serviceId, onAdded }) {
  const [dogSize, setDogSize] = useState('SMALL')
  const [price, setPrice] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await addPricing(serviceId, dogSize, Number(price), Number(durationMinutes))
      setPrice('')
      setDurationMinutes('')
      onAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 mt-4 pt-4 border-t border-border">
      <div>
        <label className="block text-xs text-text-muted mb-1">Dog Size</label>
        <select
          value={dogSize}
          onChange={(e) => setDogSize(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {DOG_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-text-muted mb-1">Price ($)</label>
        <input
          type="number" min="0" step="0.01" required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <div>
        <label className="block text-xs text-text-muted mb-1">Duration (min)</label>
        <input
          type="number" min="1" required
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          className="w-24 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        <Plus size={16} />
        {saving ? 'Adding...' : 'Add Pricing'}
      </button>
      {error && <p className="text-sm text-error w-full">{error}</p>}
    </form>
  )
}

function ServiceCard({ service, onChanged }) {
  const [showPricingForm, setShowPricingForm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editNameMk, setEditNameMk] = useState(service.nameMk)
  const [editNameEn, setEditNameEn] = useState(service.nameEn)
  const [savingEdit, setSavingEdit] = useState(false)
  const { showToast } = useToast()

  const handleDelete = async () => {
    setConfirmOpen(false)
    setDeleting(true)
    try {
      await deleteService(service.id)
      onChanged()
    } catch (err) {
      showToast("Can't delete — this service has existing bookings.", 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editNameMk.trim() || !editNameEn.trim()) return
    setSavingEdit(true)
    try {
      await updateService(service.id, editNameMk.trim(), editNameEn.trim())
      onChanged()
      setEditing(false)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSavingEdit(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="border border-border rounded-xl p-4 bg-surface"
    >
      {editing ? (
        <div className="space-y-2 mb-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">Name (Macedonian)</label>
            <input
              type="text"
              value={editNameMk}
              onChange={(e) => setEditNameMk(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Name (English)</label>
            <input
              type="text"
              value={editNameEn}
              onChange={(e) => setEditNameEn(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={savingEdit}
              className="inline-flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              <Check size={14} />
              {savingEdit ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setEditNameMk(service.nameMk)
                setEditNameEn(service.nameEn)
              }}
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:bg-background px-3 py-1.5 rounded-full transition-colors"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-text">{service.nameMk}</h3>
            <p className="text-sm text-text-muted">{service.nameEn}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 text-sm text-error hover:bg-error/10 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}

      {service.pricing.length > 0 ? (
        <table className="w-full mt-3 text-sm">
          <thead>
            <tr className="text-text-muted text-left">
              <th className="font-normal pb-1">Size</th>
              <th className="font-normal pb-1">Price</th>
              <th className="font-normal pb-1">Duration</th>
            </tr>
          </thead>
          <tbody>
            {service.pricing.map((p) => (
              <tr key={p.dogSize} className="border-t border-border">
                <td className="py-1.5 text-text">{p.dogSize}</td>
                <td className="py-1.5 text-text">${p.price}</td>
                <td className="py-1.5 text-text">{p.durationMinutes} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-text-muted mt-2">No pricing set yet.</p>
      )}

      {showPricingForm ? (
        <PricingForm
          serviceId={service.id}
          onAdded={() => {
            setShowPricingForm(false)
            onChanged()
          }}
        />
      ) : (
        <button
          onClick={() => setShowPricingForm(true)}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full mt-3 transition-colors"
        >
          <Plus size={14} />
          Add pricing
        </button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this service?"
        message={`"${service.nameMk}" and all its pricing will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </motion.div>
  )
}

export default function ServicesPanel() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [nameMk, setNameMk] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  const loadServices = () => {
    setLoading(true)
    getServices()
      .then(setServices)
      .finally(() => setLoading(false))
  }

  useEffect(loadServices, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!nameMk.trim() || !nameEn.trim()) return
    setCreating(true)
    setError(null)
    try {
      await createService(nameMk.trim(), nameEn.trim())
      setNameMk('')
      setNameEn('')
      loadServices()
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <SkeletonGrid count={3} cols="" />

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-text-muted mb-1">Name (Macedonian)</label>
          <input
            type="text"
            value={nameMk}
            onChange={(e) => setNameMk(e.target.value)}
            placeholder="на пр. Целосно чешлање"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs text-text-muted mb-1">Name (English)</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="e.g. Full Groom"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          <Plus size={16} />
          {creating ? 'Creating...' : 'Create Service'}
        </button>
      </form>
      {error && <p className="text-sm text-error">{error}</p>}

      <div className="space-y-3">
        {services.length === 0 ? (
          <p className="text-text-muted text-sm">No services yet — create one above.</p>
        ) : (
          <AnimatePresence>
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} onChanged={loadServices} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}