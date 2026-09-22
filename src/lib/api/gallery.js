import apiRequest from './client'

export function getGalleryPhotos(breed) {
  const query = breed ? `?breed=${encodeURIComponent(breed)}` : ''
  return apiRequest(`/gallery${query}`)
}

export function uploadGalleryPhoto(file, breed) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('breed', breed)
  return apiRequest('/gallery', {
    method: 'POST',
    body: formData,
  })
}

export function updateGalleryPhotoBreed(id, breed) {
  return apiRequest(`/gallery/${id}?breed=${encodeURIComponent(breed)}`, {
    method: 'PUT',
  })
}

export function deleteGalleryPhoto(id) {
  return apiRequest(`/gallery/${id}`, { method: 'DELETE' })
}