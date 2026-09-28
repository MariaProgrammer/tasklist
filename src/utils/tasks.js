export const PRIORITIES = [
  "Low",
  "Medium",
  "High",
];

const PRIORITY_ORDER = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export function sortTasks(tasks, sortType, sortOrder) {
  const direction = sortOrder === "asc" ? 1 : -1;

  return [...tasks].sort((firstTask, secondTask) => {
    if (sortType === "priority") {
      const firstPriority =
        PRIORITY_ORDER[firstTask.priority] ?? 999;
      const secondPriority =
        PRIORITY_ORDER[secondTask.priority] ?? 999;

      return (
        (firstPriority - secondPriority) * direction
      );
    }

    const firstDate = new Date(
      firstTask.deadline
    ).getTime();

    const secondDate = new Date(
      secondTask.deadline
    ).getTime();

    if (
      Number.isNaN(firstDate) &&
      Number.isNaN(secondDate)
    ) {
      return 0;
    }

    if (Number.isNaN(firstDate)) {
      return 1;
    }

    if (Number.isNaN(secondDate)) {
      return -1;
    }

    return (firstDate - secondDate) * direction;
  });
}

export function formatDeadline(deadline) {
  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Некорректная дата";
  }

  return date.toLocaleString("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getPriorityClass(priority) {
  const normalized = String(priority).toLowerCase();

  return ["low", "medium", "high"].includes(normalized)
    ? normalized
    : "low";
}

export function localDateTimeToIso(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}