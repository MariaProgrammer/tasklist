export default function AuthForm({
  mode,
  username,
  password,
  confirmPassword,
  error,
  loading,
  onModeChange,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) {
  const isLogin = mode === "login";

  return (
    <section
      className="auth-card"
      aria-labelledby="auth-title"
    >
      <div
        className="auth-tabs"
        role="tablist"
        aria-label="Режим авторизации"
      >
        <button
          className={isLogin ? "tab active" : "tab"}
          type="button"
          role="tab"
          aria-selected={isLogin}
          disabled={loading}
          onClick={() => onModeChange("login")}
        >
          Вход
        </button>

        <button
          className={!isLogin ? "tab active" : "tab"}
          type="button"
          role="tab"
          aria-selected={!isLogin}
          disabled={loading}
          onClick={() => onModeChange("register")}
        >
          Регистрация
        </button>
      </div>

      <h2 id="auth-title">
        {isLogin
          ? "С возвращением"
          : "Создать аккаунт"}
      </h2>

      <p className="auth-subtitle">
        {isLogin
          ? "Введи логин и пароль."
          : "Придумай логин и пароль."}
      </p>

      <form
        className="auth-form"
        onSubmit={onSubmit}
      >
        <label>
          Логин
          <input
            type="text"
            name="username"
            value={username}
            placeholder="например, anna"
            minLength={3}
            maxLength={50}
            autoComplete="username"
            disabled={loading}
            onChange={(event) =>
              onUsernameChange(event.target.value)
            }
            required
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            name="password"
            value={password}
            placeholder="от 6 до 128 символов"
            minLength={6}
            maxLength={128}
            autoComplete={
              isLogin
                ? "current-password"
                : "new-password"
            }
            disabled={loading}
            onChange={(event) =>
              onPasswordChange(event.target.value)
            }
            required
          />
        </label>

        {!isLogin && (
          <label>
            Повтори пароль
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              minLength={6}
              maxLength={128}
              autoComplete="new-password"
              disabled={loading}
              onChange={(event) =>
                onConfirmPasswordChange(
                  event.target.value
                )
              }
              required
            />
          </label>
        )}

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Подождите..."
            : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
        </button>
      </form>
    </section>
  );
}