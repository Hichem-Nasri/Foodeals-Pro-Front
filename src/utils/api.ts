import { auth } from '@/auth'
import axios from 'axios'
import { getAccessToken } from '@/actions'

// const token = process.env.ACCESS_TOKEN
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/v1`, // Assuming you want to use localhost:8080 as the API URL
  headers: {
    // Assuming you have the access token stored in the environment variable ACCESS_TOKEN
    'Access-Control-Allow-Origin': '*', // Add this line to allow cross-origin requests
  },
})

// Interceptor for response (global error handling, logging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data:', error.response.data)
      console.error('Status:', error.response.status)
      console.error('Headers:', error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

api.interceptors.request.use(
  async (config) => {
    const session = await getAccessToken()

    if (session) {
      config.headers['Authorization'] = `Bearer ${session}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default api
