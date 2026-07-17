import { useState } from 'react'
import Modal from './Modal.jsx'

export default function TaskEditModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onSave(task.id, { title: trimmed, description })
  }

  return (
    <Modal title="Edit card" onClose={onClose}>
      <form onSubmit={handleSubmit} className="task-edit-form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </label>
        <label>
          Description
          <textarea
            rows={5}
            placeholder="Add more detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="task-edit-form__actions">
          <button type="submit" className="btn btn--primary">
            Save changes
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
