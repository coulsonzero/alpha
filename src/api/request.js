import axios from 'axios'

const request = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 5000,
  withCredentials: true,
})

// Attach token to every request
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default request