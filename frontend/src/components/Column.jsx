import { useState } from 'react'
import TaskCard from './TaskCard.jsx'

export default function Column({
  column,
  index,
  onRenameColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDropTask,
  draggingTaskId,
  setDraggingTaskId,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(column.title)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const tabColors = ['tab-amber', 'tab-sage', 'tab-rose', 'tab-teal']
  const tabClass = tabColors[index % tabColors.length]

  const submitTitle = () => {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed)
    } else {
      setTitleDraft(column.title)
    }
    setIsEditingTitle(false)
  }

  const submitNewTask = (e) => {
    e.preventDefault()
    const trimmed = newTaskTitle.trim()
    if (!trimmed) return
    onAddTask(column.id, trimmed)
    setNewTaskTitle('')
    setIsAddingTask(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const taskId = e.dataTransfer.getData('text/plain')
    if (taskId) onDropTask(Number(taskId), column.id, column.tasks.length)
  }

  return (
    <div
      className={`column${isDragOver ? ' column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className={`column__tab ${tabClass}`} />
      <div className="column__header">
        {isEditingTitle ? (
          <input
            className="column__title-input"
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={submitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitTitle()
              if (e.key === 'Escape') {
                setTitleDraft(column.title)
                setIsEditingTitle(false)
              }
            }}
          />
        ) : (
          <h2 className="column__title" onClick={() => setIsEditingTitle(true)}>
            {column.title}
          </h2>
        )}
        <span className="column__count">{column.tasks.length}</span>
        <button
          className="icon-btn column__delete"
          aria-label="Delete column"
          onClick={() => onDeleteColumn(column)}
        >
          ✕
        </button>
      </div>

      <div className="column__tasks">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            isDragging={draggingTaskId === task.id}
            onDragStart={(e, t) => {
              setDraggingTaskId(t.id)
              e.dataTransfer.setData('text/plain', String(t.id))
              e.dataTransfer.effectAllowed = 'move'
            }}
            onDragEnd={() => setDraggingTaskId(null)}
          />
        ))}
      </div>

      {isAddingTask ? (
        <form className="add-task-form" onSubmit={submitNewTask}>
          <textarea
            autoFocus
            placeholder="Enter a title for this task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submitNewTask(e)
              }
              if (e.key === 'Escape') {
                setIsAddingTask(false)
                setNewTaskTitle('')
              }
            }}
          />
          <div className="add-task-form__actions">
            <button type="submit" className="btn btn--primary">
              Add card
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setIsAddingTask(false)
                setNewTaskTitle('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className="add-task-btn" onClick={() => setIsAddingTask(true)}>
          + Add a card
        </button>
      )}
    </div>
  )
}
