import {
  useMemo,
  useState,
} from "react";
import {
  authApi,
  isUnauthorizedError,
} from "../api";
import { useTasks } from "../hooks/useTasks";
import { sortTasks } from "../utils/tasks";
import Footer from "./Footer";
import CollapsiblePanel from "./dashboard/CollapsiblePanel";
import DashboardHeader from "./dashboard/DashboardHeader";
import OperationStatus from "./dashboard/OperationStatus";
import SortControls from "./dashboard/SortControls";
import TaskForm from "./dashboard/TaskForm";
import TaskList from "./dashboard/TaskList";

export default function Dashboard({
  token,
  user,
  onLogout,
  onProfileDeleted,
}) {
  const [sortType, setSortType] =
    useState("date");
  const [sortOrder, setSortOrder] =
    useState("asc");

  const [openSections, setOpenSections] =
    useState({
      newTask: true,
      activeTasks: true,
      completedTasks: true,
    });

  const [
    isDeletingProfile,
    setIsDeletingProfile,
  ] = useState(false);

  const [profileError, setProfileError] =
    useState("");

  const {
    tasks,
    isLoading,
    creatingTask,
    pendingTaskIds,
    error: tasksError,
    addTask,
    completeTask,
    deleteTask,
  } = useTasks({
    token,
    onUnauthorized: onLogout,
  });

  const activeTasks = useMemo(
    () =>
      sortTasks(
        tasks.filter((task) => !task.completed),
        sortType,
        sortOrder
      ),
    [tasks, sortType, sortOrder]
  );

  const completedTasks = useMemo(
    () =>
      sortTasks(
        tasks.filter((task) => task.completed),
        sortType,
        sortOrder
      ),
    [tasks, sortType, sortOrder]
  );

  function toggleSection(section) {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [section]: !currentSections[section],
    }));
  }

  function changeSort(type) {
    if (sortType === type) {
      setSortOrder((currentOrder) =>
        currentOrder === "asc"
          ? "desc"
          : "asc"
      );
      return;
    }

    setSortType(type);
    setSortOrder("asc");
  }

  async function handleDeleteProfile() {
    const confirmed = window.confirm(
      "Удалить профиль? Все задачи будут удалены без возможности восстановления."
    );

    if (!confirmed || isDeletingProfile) {
      return;
    }

    setIsDeletingProfile(true);
    setProfileError("");

    try {
      await authApi.deleteProfile(token);
      onProfileDeleted();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        onLogout();
        return;
      }

      setProfileError(
        error.message ||
          "Не удалось удалить профиль"
      );
    } finally {
      setIsDeletingProfile(false);
    }
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader
        username={user.username}
        onLogout={onLogout}
        onDeleteProfile={handleDeleteProfile}
        isDeletingProfile={isDeletingProfile}
      />

      <OperationStatus
        isLoading={isLoading}
        error={profileError || tasksError}
      />

      <main className="dashboard-grid">
        <CollapsiblePanel
          title="Новая задача"
          isOpen={openSections.newTask}
          onToggle={() =>
            toggleSection("newTask")
          }
        >
          <TaskForm
            onAddTask={addTask}
            isSubmitting={creatingTask}
          />
        </CollapsiblePanel>

        <CollapsiblePanel
          title="Активные задачи"
          isOpen={openSections.activeTasks}
          onToggle={() =>
            toggleSection("activeTasks")
          }
        >
          <SortControls
            sortType={sortType}
            sortOrder={sortOrder}
            onSortChange={changeSort}
          />

          <TaskList
            tasks={activeTasks}
            emptyMessage="Активных задач пока нет."
            pendingTaskIds={pendingTaskIds}
            onComplete={completeTask}
            onDelete={deleteTask}
          />
        </CollapsiblePanel>

        <CollapsiblePanel
          title="Завершённые задачи"
          isOpen={openSections.completedTasks}
          onToggle={() =>
            toggleSection("completedTasks")
          }
        >
          <TaskList
            tasks={completedTasks}
            emptyMessage="Завершённых задач пока нет."
            pendingTaskIds={pendingTaskIds}
            onDelete={deleteTask}
          />
        </CollapsiblePanel>
      </main>

      <Footer />
    </div>
  );
}