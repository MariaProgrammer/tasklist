import { useState } from "react";
import {
  localDateTimeToIso,
  PRIORITIES,
} from "../../utils/tasks";

export default function TaskForm({
  onAddTask,
  isSubmitting,
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] =
    useState("Low");
  const [deadline, setDeadline] = useState("");
  const [validationError, setValidationError] =
    useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const deadlineIso =
      localDateTimeToIso(deadline);

    if (!normalizedTitle) {
      setValidationError(
        "Введите название задачи"
      );
      return;
    }

    if (!deadlineIso) {
      setValidationError(
        "Укажите корректный срок выполнения"
      );
      return;
    }

    setValidationError("");

    const created = await onAddTask({
      title: normalizedTitle,
      priority,
      deadline: deadlineIso,
    });

    if (created) {
      setTitle("");
      setPriority("Low");
      setDeadline("");
    }
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="task-title">
        Название задачи
      </label>

      <input
        id="task-title"
        type="text"
        value={title}
        maxLength={500}
        disabled={isSubmitting}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        required
      />

      <label htmlFor="task-priority">
        Приоритет
      </label>

      <select
        id="task-priority"
        value={priority}
        disabled={isSubmitting}
        onChange={(event) =>
          setPriority(event.target.value)
        }
      >
        {PRIORITIES.map((priorityOption) => (
          <option
            key={priorityOption}
            value={priorityOption}
          >
            {priorityOption}
          </option>
        ))}
      </select>

      <label htmlFor="task-deadline">
        Срок выполнения
      </label>

      <input
        id="task-deadline"
        type="datetime-local"
        value={deadline}
        disabled={isSubmitting}
        onChange={(event) =>
          setDeadline(event.target.value)
        }
        required
      />

      {validationError && (
        <div className="form-error" role="alert">
          {validationError}
        </div>
      )}

      <button
        className="primary-button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Добавление..."
          : "Добавить задачу"}
      </button>
    </form>
  );
}