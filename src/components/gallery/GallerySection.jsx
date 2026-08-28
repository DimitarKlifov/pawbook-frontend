import { useEffect, useState } from 'react'
import { getGalleryPhotos } from '../../lib/api/gallery'

function GallerySection() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getGalleryPhotos()
      .then((data) => setPhotos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-display text-primary font-semibold tracking-wide uppercase text-sm mb-3">
            Happy Dogs
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text mb-4">
            See the results for yourself
          </h2>
          <p className="font-body text-text-muted text-lg">
            A few of our recent transformations.
          </p>
        </div>

        {loading && (
          <p className="text-center font-body text-text-muted">Loading photos...</p>
        )}

        {error && (
          <p className="text-center font-body text-error">
            Couldn't load gallery photos right now.
          </p>
        )}

        {!loading && !error && photos.length === 0 && (
          <p className="text-center font-body text-text-muted">
            No photos yet — check back soon!
          </p>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {photos.map((photo) => (
  <div
    key={photo.id}
    className="rounded-3xl overflow-hidden bg-surface group"
  >
    <div className="aspect-square overflow-hidden">
      <img
        src={photo.imageUrl}
        alt={`Groomed ${photo.breed}`}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <p className="font-body text-sm font-semibold text-text-muted text-center py-2 capitalize">
      {photo.breed}
    </p>
  </div>
))}
          </div>
        )}
      </div>
    </section>
  )
}

export default GallerySection