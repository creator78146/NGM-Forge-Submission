import { useEffect, useState, useCallback } from 'react'
import Board from './components/Board.jsx'
import TaskEditModal from './components/TaskEditModal.jsx'
import api from './api/api.js'

export default function App() {
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  const loadBoard = useCallback(async () => {
    try {
      setError(null)
      const data = await api.getBoard()
      setColumns(data)
    } catch (err) {
      console.error(err)
      setError('Could not reach the API. Is the Laravel backend running on the expected URL?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBoard()
  }, [loadBoard])

  // ----- Columns -----

  const handleAddColumn = async (title) => {
    const newColumn = await api.createColumn(title)
    setColumns((prev) => [...prev, newColumn])
  }

  const handleRenameColumn = async (columnId, title) => {
    setColumns((prev) => prev.map((c) => (c.id === columnId ? { ...c, title } : c)))
    await api.updateColumn(columnId, { title })
  }

  const handleDeleteColumn = async (column) => {
    if (!window.confirm(`Delete "${column.title}" and all of its cards?`)) return
    setColumns((prev) => prev.filter((c) => c.id !== column.id))
    await api.deleteColumn(column.id)
  }

  // ----- Tasks -----

  const handleAddTask = async (columnId, title) => {
    const task = await api.createTask(columnId, title, '')
    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c)),
    )
  }

  const handleEditTask = (task) => setEditingTask(task)

  const handleSaveTask = async (taskId, data) => {
    const updated = await api.updateTask(taskId, data)
    setColumns((prev) =>
      prev.map((c) => ({
        ...c,
        tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, ...updated } : t)),
      })),
    )
    setEditingTask(null)
  }

  const handleDeleteTask = async (task) => {
    setColumns((prev) =>
      prev.map((c) => ({ ...c, tasks: c.tasks.filter((t) => t.id !== task.id) })),
    )
    await api.deleteTask(task.id)
  }

  const handleDropTask = async (taskId, targetColumnId, targetIndex) => {
    let movedTask = null
    setColumns((prev) => {
      const next = prev.map((c) => ({ ...c, tasks: [...c.tasks] }))
      for (const c of next) {
        const idx = c.tasks.findIndex((t) => t.id === taskId)
        if (idx !== -1) {
          movedTask = c.tasks[idx]
          c.tasks.splice(idx, 1)
          break
        }
      }
      if (!movedTask) return prev
      const target = next.find((c) => c.id === targetColumnId)
      target.tasks.splice(targetIndex, 0, { ...movedTask, column_id: targetColumnId })
      return next
    })

    if (movedTask) {
      await api.moveTask(taskId, targetColumnId, targetIndex)
    }
  }

  if (loading) {
    return (
      <div className="state-screen">
        <p>Loading board…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-screen">
        <p className="state-screen__error">{error}</p>
        <button className="btn btn--primary" onClick={loadBoard}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Kanban Board</h1>
      </header>

      <main className="app__main">
        <Board
          columns={columns}
          onAddColumn={handleAddColumn}
          onRenameColumn={handleRenameColumn}
          onDeleteColumn={handleDeleteColumn}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onDropTask={handleDropTask}
        />
      </main>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}
