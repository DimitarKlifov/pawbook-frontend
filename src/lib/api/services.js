import apiRequest from './client'

export function getServices() {
  return apiRequest('/services')
}

export function createService(nameMk, nameEn) {
  return apiRequest('/services', {
    method: 'POST',
    body: JSON.stringify({ nameMk, nameEn }),
  })
}

export function addPricing(serviceId, dogSize, price, durationMinutes) {
  return apiRequest(`/services/${serviceId}/pricing`, {
    method: 'POST',
    body: JSON.stringify({ dogSize, price, durationMinutes }),
  })
}

export function updateService(id, nameMk, nameEn) {
  return apiRequest(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nameMk, nameEn }),
  })
}

export function deleteService(id) {
  return apiRequest(`/services/${id}`, { method: 'DELETE' })
}