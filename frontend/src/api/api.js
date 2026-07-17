import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export const api = {
  // Board
  getBoard: () => client.get('/board').then((res) => res.data),

  // Columns
  createColumn: (title) => client.post('/columns', { title }).then((res) => res.data),
  updateColumn: (id, data) => client.put(`/columns/${id}`, data).then((res) => res.data),
  deleteColumn: (id) => client.delete(`/columns/${id}`),

  // Tasks
  createTask: (columnId, title, description) =>
    client
      .post('/tasks', { column_id: columnId, title, description })
      .then((res) => res.data),
  updateTask: (id, data) => client.put(`/tasks/${id}`, data).then((res) => res.data),
  deleteTask: (id) => client.delete(`/tasks/${id}`),
  moveTask: (id, columnId, position) =>
    client.patch(`/tasks/${id}/move`, { column_id: columnId, position }).then((res) => res.data),
}

export default api
