import request from './request'

export function fetchComments() {
  return request.get('/comment')
}

export function createComment(data) {
  return request.post('/comment', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
