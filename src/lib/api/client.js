const API_BASE_URL = 'http://localhost:8080'

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = isJson ? data.message : data
    throw new Error(message || `Request failed: ${response.status}`)
  }

  return data
}

export default apiRequest