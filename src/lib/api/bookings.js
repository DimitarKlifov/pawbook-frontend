import apiRequest from './client'

export function getAvailability(date, serviceId, petId) {
  return apiRequest(`/availability?date=${date}&serviceId=${serviceId}&petId=${petId}`)
}

export function createBooking(petId, serviceId, date, startTime) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify({ petId, serviceId, date, startTime }),
  })
}

export function getMyBookings() {
  return apiRequest('/bookings/mine') // fixed: was /bookings/mine, backend route is singular "booking"
}

export function cancelBooking(id) {
  return apiRequest(`/bookings/${id}/cancel`, {
    method: 'PUT',
  })
}

export function getAllBookings() {
  return apiRequest('/bookings')
}