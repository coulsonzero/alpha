import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
})

export function getHotSearch() {
  return request.get('/hot_search')
}
