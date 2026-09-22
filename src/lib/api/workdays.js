import apiRequest from './client'

export function getWorkDaysByMonth(yearMonth) {
  // yearMonth format: "2026-08"
  return apiRequest(`/workdays?month=${yearMonth}`)
}

export function setWorkDay(date, open, startTime, endTime) {
  return apiRequest('/workdays', {
    method: 'PUT',
    body: JSON.stringify({ date, open, startTime, endTime }),
  })
}