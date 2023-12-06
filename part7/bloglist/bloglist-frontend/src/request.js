import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

export const setToken = newToken => {
  token = `bearer ${newToken}`
}

export const getComments = async (blog) => {
  const response = await axios.get(`${baseUrl}/${blog.id}/comments`)
  return response.data
}

export const addComment = async ( content ) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(`${baseUrl}/${content.blog.id}/comments`, content, config)
  return response.data
}

export const getBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const createBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

export const updateLike = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return response.data
}

export const deleteBlog = async (deletedBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${deletedBlog.id}`, config)

  return response.data
}

export const login = async (credentials) => {
  const response = await axios.post('http://localhost:3003/api/login', credentials)
  return response.data
}

export const getUsers = async () => {
  const response = await axios.get('http://localhost:3003/api/users')
  return response.data
}

