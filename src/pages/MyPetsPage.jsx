import { useEffect, useState } from 'react'
import { getMyPets, createPet } from '../lib/api/pets'

function MyPetsPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', breed: '', size: 'MEDIUM', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      await createPet(formData.name, formData.breed, formData.size, formData.notes)
      setFormData({ name: '', breed: '', size: 'MEDIUM', notes: '' })
      setShowForm(false)
      loadPets()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-text">My Pets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-5 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark transition-colors duration-200"
        >
          {showForm ? 'Cancel' : '+ Add a Pet'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-3xl p-6 mb-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-body text-sm font-semibold text-text mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="breed" className="block font-body text-sm font-semibold text-text mb-1">
                Breed
              </label>
              <input
                id="breed"
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
            <label htmlFor="size" className="block font-body text-sm font-semibold text-text mb-1">
              Size
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block font-body text-sm font-semibold text-text mb-1">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
          </div>

          {formError && <p className="font-body text-sm text-error">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2.5 rounded-full font-display font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200"
          >
            {submitting ? 'Adding...' : 'Add Pet'}
          </button>
        </form>
      )}

      {loading && <p className="font-body text-text-muted">Loading your pets...</p>}
      {error && <p className="font-body text-error">{error}</p>}

      {!loading && !error && pets.length === 0 && (
        <p className="font-body text-text-muted text-center py-12">
          You haven't added any pets yet.
        </p>
      )}

      {!loading && !error && pets.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-surface border border-border rounded-2xl p-5">
              <h3 className="font-display font-bold text-text text-lg">{pet.name}</h3>
              <p className="font-body text-text-muted text-sm capitalize">
                {pet.breed} · {pet.size.toLowerCase()}
              </p>
              {pet.notes && (
                <p className="font-body text-text-muted text-sm mt-2">{pet.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyPetsPage