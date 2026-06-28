import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
})

export function getHotSearch(date) {
  const params = date ? { date } : {}
  return request.get('/hot_search', { params })
}
