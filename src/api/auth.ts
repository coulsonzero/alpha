import request from './request'

export function login(data: { username: string; password: string }) {
  console.log("[API] login  username=", data.username)
  return request.post('/login', data)
}

export function register(data: { username: string; password: string; email?: string } | FormData, isFormData?: boolean) {
  if (isFormData) {
    return request.post('/register', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
  return request.post('/register', data)
}

export function getMe() {
  return request.get('/me')
}

export function logout() {
  return request.post('/logout')
}
