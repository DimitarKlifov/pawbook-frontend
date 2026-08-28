const API_BASE_URL = 'http://localhost:8080'

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Something went wrong' }))
    throw new Error(errorBody.message || `Request failed: ${response.status}`)
  }

  return response.json()
}

export default apiRequest