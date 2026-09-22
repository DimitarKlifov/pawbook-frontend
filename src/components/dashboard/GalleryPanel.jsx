import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Upload, Trash2, Pencil, Check, X } from 'lucide-react'
import { getGalleryPhotos, uploadGalleryPhoto, updateGalleryPhotoBreed, deleteGalleryPhoto } from '../../lib/api/gallery'
import ConfirmDialog from '../ui/ConfirmDialog'
import { SkeletonGrid } from '../ui/Skeleton'

function PhotoCard({ photo, onSaved, onRequestDelete, deleting }) {
  const [editing, setEditing] = useState(false)
  const [breedValue, setBreedValue] = useState(photo.breed)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!breedValue.trim()) return
    setSaving(true)
    try {
      await updateGalleryPhotoBreed(photo.id, breedValue.trim())
      onSaved()
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="relative group rounded-2xl overflow-hidden bg-surface border border-border"
    >
      <div className="aspect-square overflow-hidden">
        <img src={photo.imageUrl} alt={photo.breed} className="w-full h-full object-cover" />
      </div>

      {editing ? (
        <div className="flex items-center gap-1 p-1.5">
          <input
            type="text"
            value={breedValue}
            onChange={(e) => setBreedValue(e.target.value)}
            autoFocus
            className="flex-1 min-w-0 text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="shrink-0 p-1 rounded text-success hover:bg-success/10 disabled:opacity-50"
            aria-label="Save"
          >
            <Check size={14} />
          </button>
          <button
            onClick={() => { setEditing(false); setBreedValue(photo.breed) }}
            className="shrink-0 p-1 rounded text-text-muted hover:bg-background"
            aria-label="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="text-xs text-text-muted text-center py-1.5 capitalize">{photo.breed}</p>
      )}

      {!editing && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center bg-primary text-white text-xs p-1.5 rounded-full"
            aria-label="Edit breed"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={onRequestDelete}
            disabled={deleting}
            className="inline-flex items-center bg-error text-white text-xs p-1.5 rounded-full disabled:opacity-50"
            aria-label="Delete photo"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default function GalleryPanel() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [breed, setBreed] = useState('')
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const loadPhotos = () => {
    setLoading(true)
    getGalleryPhotos()
      .then(setPhotos)
      .finally(() => setLoading(false))
  }

  useEffect(loadPhotos, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !breed.trim()) return
    setUploading(true)
    setError(null)
    try {
      await uploadGalleryPhoto(file, breed.trim())
      setFile(null)
      setFileName(null)
      setBreed('')
      e.target.reset()
      loadPhotos()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    setConfirmDeleteId(null)
    setDeletingId(id)
    try {
      await deleteGalleryPhoto(id)
      loadPhotos()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3 border border-border rounded-xl p-4 bg-surface">
        <div>
          <label className="block text-xs text-text-muted mb-1">Breed</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="e.g. Poodle"
            className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">Photo</label>
          <label
            htmlFor="gallery-file"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Upload size={16} />
            {fileName || 'Choose Photo'}
          </label>
          <input
            id="gallery-file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files[0])
              setFileName(e.target.files[0]?.name)
            }}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !file || !breed.trim()}
          className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
        {error && <p className="text-sm text-error w-full">{error}</p>}
      </form>

      {loading ? (
        <SkeletonGrid count={4} cols="sm:grid-cols-2 md:grid-cols-4" />
      ) : photos.length === 0 ? (
        <p className="text-text-muted text-sm">No photos yet — upload one above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onSaved={loadPhotos}
                onRequestDelete={() => setConfirmDeleteId(photo.id)}
                deleting={deletingId === photo.id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete this photo?"
        message="This photo will be permanently removed from the gallery."
        confirmLabel="Delete"
        onConfirm={() => handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}