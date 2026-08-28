import apiRequest from './client'

export function getServices() {
  return apiRequest('/services')
}