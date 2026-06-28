import axios from 'axios'

const request = axios.create({
  baseURL: '/api/v1',
})

export default request