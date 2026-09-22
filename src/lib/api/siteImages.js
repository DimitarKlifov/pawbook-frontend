import apiRequest from './client'

export const getSiteImages = async () => {
  const list = await apiRequest('/site-images')
  return list.reduce((acc, item) => {
    acc[item.slot.toLowerCase()] = item
    return acc
  }, {})
}

export const uploadSiteImage = (slot, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest(`/site-images/${slot.toUpperCase()}`, {
    method: 'POST',
    body: formData,
  })
}

export const updateSiteText = (slot, headingMk, headingEn, textMk, textEn) =>
  apiRequest(`/site-images/${slot.toUpperCase()}/text`, {
    method: 'PUT',
    body: JSON.stringify({ headingMk, headingEn, textMk, textEn }),
  })