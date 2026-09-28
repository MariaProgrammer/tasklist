export default function AuthIntro() {
  return (
    <section className="auth-left">
      <div className="brand-badge">Task List</div>

      <h1>Личный кабинет с заметками</h1>

      <p>
        Войди в аккаунт или зарегистрируй новый
        профиль. После входа ты увидишь только свои
        задачи.
      </p>

      <ul className="feature-list">
        <li>Безопасное хранение хешей паролей</li>
        <li>Отдельные задачи для каждого пользователя</li>
        <li>CRUD-операции без перезаписи всего списка</li>
        <li>Хранение задач в PostgreSQL</li>
      </ul>
    </section>
  );
}