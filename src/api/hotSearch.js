import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
})

export function getHotSearch(date) {
  const params = date ? { date } : {}
  return request.get('/hot_search', { params })
}

export function getTodos() {
  return request.get('/task')
}

export function createTodo(data) {
  return request.post('/task', data)
}
