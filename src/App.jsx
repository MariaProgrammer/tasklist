import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  authApi,
  isUnauthorizedError,
} from "./api/index.js";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";

const TOKEN_KEY = "tasklist_token";

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function App() {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(null);
  const [bootLoading, setBootLoading] = useState(
    Boolean(getStoredToken())
  );
  const [bootError, setBootError] = useState("");
  const [restoreAttempt, setRestoreAttempt] = useState(0);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);

    setToken("");
    setUser(null);
    setBootLoading(false);
    setBootError("");
  }, []);

  const handleSessionExpired = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);

    setToken("");
    setUser(null);
    setBootLoading(false);
    setBootError(
      "Сессия истекла. Пожалуйста, войдите снова."
    );
  }, []);

  const handleAuthSuccess = useCallback(
    (nextToken, nextUser) => {
      localStorage.setItem(TOKEN_KEY, nextToken);

      setToken(nextToken);
      setUser(nextUser);
      setBootError("");
      setBootLoading(false);
    },
    []
  );

  const retrySessionRestore = useCallback(() => {
    setBootError("");
    setRestoreAttempt(
      (currentAttempt) => currentAttempt + 1
    );
  }, []);

  useEffect(() => {
    if (!token) {
      setBootLoading(false);
      return undefined;
    }

    /*
     * После успешного login/register пользователь уже получен
     * в ответе backend, поэтому дополнительный запрос /auth/me
     * не требуется.
     */
    if (user) {
      setBootLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    async function restoreSession() {
      setBootLoading(true);
      setBootError("");

      try {
        const data = await authApi.me(token, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setUser(data.user);
        }
      } catch (error) {
        if (
          error.name === "AbortError" ||
          controller.signal.aborted
        ) {
          return;
        }

        if (isUnauthorizedError(error)) {
          handleSessionExpired();
          return;
        }

        /*
         * При временной ошибке сети или backend токен не удаляется.
         * Пользователь сможет повторить проверку сессии.
         */
        setBootError(
          error.message ||
            "Не удалось подключиться к серверу."
        );
      } finally {
        if (!controller.signal.aborted) {
          setBootLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      controller.abort();
    };
  }, [
    token,
    user,
    restoreAttempt,
    handleSessionExpired,
  ]);

  if (bootLoading) {
    return (
      <main className="page-center">
        <div
          className="loading-card"
          role="status"
          aria-live="polite"
        >
          <div
            className="spinner"
            aria-hidden="true"
          />

          <p>Проверяем сессию...</p>
        </div>
      </main>
    );
  }

  /*
   * Токен есть, но получить пользователя не удалось из-за
   * временной ошибки. Не показываем AuthPage и не удаляем токен.
   */
  if (token && !user) {
    return (
      <main className="page-center">
        <div className="loading-card">
          <h1>Не удалось восстановить сессию</h1>

          <p className="session-error" role="alert">
            {bootError ||
              "Сервер временно недоступен."}
          </p>

          <div className="session-actions">
            <button
              className="primary-button"
              type="button"
              onClick={retrySessionRestore}
            >
              Повторить
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={handleLogout}
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!token || !user) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        initialError={bootError}
      />
    );
  }

  return (
    <Dashboard
      token={token}
      user={user}
      onLogout={handleLogout}
      onProfileDeleted={handleLogout}
    />
  );
}

export default App;