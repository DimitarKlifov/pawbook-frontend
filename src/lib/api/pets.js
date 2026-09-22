import apiRequest from './client'

export function getMyPets() {
  return apiRequest('/pets')
}

export function createPet(name, breed, size, notes) {
  return apiRequest('/pets', {
    method: 'POST',
    body: JSON.stringify({ name, breed, size, notes }),
  })
}

export function updatePet(id, name, breed, size, notes) {
  return apiRequest(`/pets/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, breed, size, notes }),
  })
}

export function deletePet(id) {
  return apiRequest(`/pets/${id}`, { method: 'DELETE' })
}