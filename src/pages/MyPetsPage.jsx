import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Plus, PawPrint } from 'lucide-react'
import { getMyPets, createPet, updatePet, deletePet } from '../lib/api/pets'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ErrorState from '../components/ui/ErrorState'
import { SkeletonGrid } from '../components/ui/Skeleton'
import { useToast } from '../context/ToastContext'

function PetForm({ initialData, submitLabel, onSubmit, onCancel }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(initialData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-3xl p-6 mb-6 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm font-semibold text-text mb-1">{t('pets.name')}</label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>
        <div>
          <label className="block font-body text-sm font-semibold text-text mb-1">{t('pets.breed')}</label>
          <input
            name="breed"
            type="text"
            required
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-text mb-1">{t('pets.size')}</label>
        <select
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        >
          <option value="SMALL">{t('pets.small')}</option>
          <option value="MEDIUM">{t('pets.medium')}</option>
          <option value="LARGE">{t('pets.large')}</option>
        </select>
      </div>

      <div>
        <label className="block font-body text-sm font-semibold text-text mb-1">{t('pets.notesOptional')}</label>
        <textarea
          name="notes"
          rows="2"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      </div>

      {error && <p className="font-body text-sm text-error">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200"
        >
          {submitting ? '...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="font-body text-sm text-text-muted hover:text-primary px-4"
          >
            {t('pets.cancel')}
          </button>
        )}
      </div>
    </motion.form>
  )
}

function MyPetsPage() {
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPetId, setEditingPetId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadPets()
  }, [])

  function loadPets() {
    setLoading(true)
    getMyPets()
      .then((data) => setPets(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  async function handleCreate(formData) {
    await createPet(formData.name, formData.breed, formData.size, formData.notes)
    setShowAddForm(false)
    loadPets()
  }

  async function handleUpdate(id, formData) {
    await updatePet(id, formData.name, formData.breed, formData.size, formData.notes)
    setEditingPetId(null)
    loadPets()
  }

  async function handleDelete(id) {
    setConfirmDeleteId(null)
    setDeletingId(id)
    try {
      await deletePet(id)
      loadPets()
    } catch (err) {
      showToast(
        i18n.language === 'mk'
          ? 'Не може да се избрише — миленикот има претходни термини.'
          : "Can't delete — this pet has existing bookings.",
        'error'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const sizeLabel = (size) => t(`pets.${size.toLowerCase()}`)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-text">{t('pets.title')}</h1>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingPetId(null) }}
          className="inline-flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
        >
          <Plus size={16} />
          {showAddForm ? t('pets.cancel') : t('pets.addPet')}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <PetForm
            initialData={{ name: '', breed: '', size: 'MEDIUM', notes: '' }}
            submitLabel={t('pets.save')}
            onSubmit={handleCreate}
          />
        )}
      </AnimatePresence>

      {loading && <SkeletonGrid count={4} cols="sm:grid-cols-2" />}
      {error && <ErrorState message={error} onRetry={loadPets} />}

      {!loading && !error && pets.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <PawPrint className="mx-auto text-text-muted/40" size={40} strokeWidth={1.5} />
          <p className="font-body text-text-muted">{t('pets.noPets')}</p>
        </div>
      )}

      {!loading && !error && pets.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
            {pets.map((pet) =>
              editingPetId === pet.id ? (
                <PetForm
                  key={pet.id}
                  initialData={{ name: pet.name, breed: pet.breed, size: pet.size, notes: pet.notes || '' }}
                  submitLabel={t('pets.saveChanges')}
                  onSubmit={(formData) => handleUpdate(pet.id, formData)}
                  onCancel={() => setEditingPetId(null)}
                />
              ) : (
                <motion.div
                  key={pet.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="bg-surface border border-border rounded-2xl p-5 flex items-start justify-between"
                >
                  <div>
                    <h3 className="font-display font-bold text-text text-lg">{pet.name}</h3>
                    <p className="font-body text-text-muted text-sm">
                      {pet.breed} · {sizeLabel(pet.size)}
                    </p>
                    {pet.notes && (
                      <p className="font-body text-text-muted text-sm mt-2">{pet.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0 ml-3">
                    <button
                      onClick={() => { setEditingPetId(pet.id); setShowAddForm(false) }}
                      className="p-2 rounded-full text-text-muted hover:bg-background hover:text-primary transition-colors"
                      aria-label={`Edit ${pet.name}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(pet.id)}
                      disabled={deletingId === pet.id}
                      className="p-2 rounded-full text-text-muted hover:bg-error/10 hover:text-error transition-colors disabled:opacity-50"
                      aria-label={`Delete ${pet.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title={t('pets.deleteTitle')}
        message={t('pets.deleteMessage')}
        confirmLabel={t('pets.delete')}
        onConfirm={() => handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

export default MyPetsPage