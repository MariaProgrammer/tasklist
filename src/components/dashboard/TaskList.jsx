import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  emptyMessage,
  pendingTaskIds,
  onComplete,
  onDelete,
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isPending={pendingTaskIds.has(
            String(task.id)
          )}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}