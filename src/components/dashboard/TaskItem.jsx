import {
  formatDeadline,
  getPriorityClass,
} from "../../utils/tasks";

export default function TaskItem({
  task,
  isPending,
  onComplete,
  onDelete,
}) {
  return (
    <li
      className={`task-item ${getPriorityClass(
        task.priority
      )} ${task.completed ? "completed" : ""}`}
    >
      <div className="task-info">
        <div className="task-title">
          {task.title}{" "}
          <strong>{task.priority}</strong>
        </div>

        <div className="task-deadline">
          Срок: {formatDeadline(task.deadline)}
        </div>
      </div>

      <div className="task-buttons">
        {!task.completed && onComplete && (
          <button
            className="secondary-button"
            type="button"
            disabled={isPending}
            onClick={() => onComplete(task.id)}
          >
            {isPending
              ? "Обработка..."
              : "Завершить"}
          </button>
        )}

        <button
          className="danger-button small"
          type="button"
          disabled={isPending}
          onClick={() => onDelete(task.id)}
        >
          {isPending ? "Обработка..." : "Удалить"}
        </button>
      </div>
    </li>
  );
}