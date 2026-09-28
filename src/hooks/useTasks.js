import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  isUnauthorizedError,
  tasksApi,
} from "../api";

export function useTasks({
  token,
  onUnauthorized,
}) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [
    creatingTask,
    setCreatingTask,
  ] = useState(false);
  const [
    pendingTaskIds,
    setPendingTaskIds,
  ] = useState(() => new Set());
  const [error, setError] = useState("");

  const handleApiError = useCallback(
    (requestError, fallbackMessage) => {
      if (isUnauthorizedError(requestError)) {
        onUnauthorized();
        return;
      }

      setError(
        requestError.message || fallbackMessage
      );
    },
    [onUnauthorized]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      setIsLoading(true);
      setError("");

      try {
        const data = await tasksApi.getAll(token, {
          signal: controller.signal,
        });

        setTasks(
          Array.isArray(data.tasks)
            ? data.tasks
            : []
        );
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          handleApiError(
            requestError,
            "Не удалось загрузить задачи"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();

    return () => controller.abort();
  }, [token, handleApiError]);

  const markTaskPending = useCallback((taskId) => {
    setPendingTaskIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(String(taskId));
      return nextIds;
    });
  }, []);

  const unmarkTaskPending = useCallback((taskId) => {
    setPendingTaskIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(String(taskId));
      return nextIds;
    });
  }, []);

  const addTask = useCallback(
    async (taskData) => {
      setCreatingTask(true);
      setError("");

      try {
        const data = await tasksApi.create(
          token,
          taskData
        );

        setTasks((currentTasks) => [
          ...currentTasks,
          data.task,
        ]);

        return true;
      } catch (requestError) {
        handleApiError(
          requestError,
          "Не удалось создать задачу"
        );
        return false;
      } finally {
        setCreatingTask(false);
      }
    },
    [token, handleApiError]
  );

  const updateTask = useCallback(
    async (taskId, changes) => {
      markTaskPending(taskId);
      setError("");

      try {
        const data = await tasksApi.update(
          token,
          taskId,
          changes
        );

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            String(task.id) === String(taskId)
              ? data.task
              : task
          )
        );

        return true;
      } catch (requestError) {
        handleApiError(
          requestError,
          "Не удалось обновить задачу"
        );
        return false;
      } finally {
        unmarkTaskPending(taskId);
      }
    },
    [
      token,
      handleApiError,
      markTaskPending,
      unmarkTaskPending,
    ]
  );

  const completeTask = useCallback(
    (taskId) =>
      updateTask(taskId, {
        completed: true,
      }),
    [updateTask]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      markTaskPending(taskId);
      setError("");

      try {
        await tasksApi.remove(token, taskId);

        setTasks((currentTasks) =>
          currentTasks.filter(
            (task) =>
              String(task.id) !== String(taskId)
          )
        );

        return true;
      } catch (requestError) {
        handleApiError(
          requestError,
          "Не удалось удалить задачу"
        );
        return false;
      } finally {
        unmarkTaskPending(taskId);
      }
    },
    [
      token,
      handleApiError,
      markTaskPending,
      unmarkTaskPending,
    ]
  );

  return {
    tasks,
    isLoading,
    creatingTask,
    pendingTaskIds,
    error,
    clearError: () => setError(""),
    addTask,
    updateTask,
    completeTask,
    deleteTask,
  };
}