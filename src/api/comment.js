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

export async function likesComment(id, action) {
  console.log(`[API] likesComment  id=${id}  action=${action}  url=/comment/${id}/likes`)
  return request.post(`/comment/${id}/likes`, { action }, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
