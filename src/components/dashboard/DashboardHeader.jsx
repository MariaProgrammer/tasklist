export default function DashboardHeader({
  username,
  onLogout,
  onDeleteProfile,
  isDeletingProfile,
}) {
  return (
    <header className="dashboard-header">
      <div>
        <div className="brand-badge">Task List</div>
        <h1>Привет, {username}</h1>
        <p>Это твой личный кабинет с задачами.</p>
      </div>

      <div className="header-actions">
        <button
          className="secondary-button"
          type="button"
          disabled={isDeletingProfile}
          onClick={onLogout}
        >
          Выйти
        </button>

        <button
          className="danger-button"
          type="button"
          disabled={isDeletingProfile}
          onClick={onDeleteProfile}
        >
          {isDeletingProfile
            ? "Удаление..."
            : "Удалить профиль"}
        </button>
      </div>
    </header>
  );
}