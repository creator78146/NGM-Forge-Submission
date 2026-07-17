export default function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd, isDragging }) {
  return (
    <div
      className={`task-card${isDragging ? ' task-card--dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="task-card__body" onClick={() => onEdit(task)}>
        <p className="task-card__title">{task.title}</p>
        {task.description && <p className="task-card__desc">{task.description}</p>}
      </div>
      <button
        className="icon-btn task-card__delete"
        aria-label="Delete task"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task)
        }}
      >
        ✕
      </button>
    </div>
  )
}
