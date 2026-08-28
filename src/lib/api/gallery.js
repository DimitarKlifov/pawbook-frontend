import apiRequest from './client'

export function getGalleryPhotos(breed) {
  const query = breed ? `?breed=${encodeURIComponent(breed)}` : ''
  return apiRequest(`/gallery${query}`)
}