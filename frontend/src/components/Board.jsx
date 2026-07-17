import { useState } from 'react'
import Column from './Column.jsx'

export default function Board({
  columns,
  onAddColumn,
  onRenameColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDropTask,
}) {
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [draggingTaskId, setDraggingTaskId] = useState(null)

  const submitNewColumn = (e) => {
    e.preventDefault()
    const trimmed = newColumnTitle.trim()
    if (!trimmed) return
    onAddColumn(trimmed)
    setNewColumnTitle('')
    setIsAddingColumn(false)
  }

  return (
    <div className="board">
      {columns.map((column, index) => (
        <Column
          key={column.id}
          column={column}
          index={index}
          onRenameColumn={onRenameColumn}
          onDeleteColumn={onDeleteColumn}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onDropTask={onDropTask}
          draggingTaskId={draggingTaskId}
          setDraggingTaskId={setDraggingTaskId}
        />
      ))}

      <div className="add-column">
        {isAddingColumn ? (
          <form onSubmit={submitNewColumn} className="add-column__form">
            <input
              autoFocus
              placeholder="Column name..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsAddingColumn(false)
                  setNewColumnTitle('')
                }
              }}
            />
            <div className="add-column__actions">
              <button type="submit" className="btn btn--primary">
                Add column
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setIsAddingColumn(false)
                  setNewColumnTitle('')
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button className="add-column__btn" onClick={() => setIsAddingColumn(true)}>
            + Add another column
          </button>
        )}
      </div>
    </div>
  )
}
