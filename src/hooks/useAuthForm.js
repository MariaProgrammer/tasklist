import { useEffect, useState } from "react";
import { authApi } from "../api";

export function useAuthForm({
  onAuthSuccess,
  initialError = "",
}) {
  const [mode, setModeState] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  function setMode(nextMode) {
    if (loading || mode === nextMode) {
      return;
    }

    setModeState(nextMode);
    setError("");
    setConfirmPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedUsername = username.trim();

    if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 50
    ) {
      setError(
        "Логин должен содержать от 3 до 50 символов"
      );
      return;
    }

    if (
      password.length < 6 ||
      password.length > 128
    ) {
      setError(
        "Пароль должен содержать от 6 до 128 символов"
      );
      return;
    }

    if (
      mode === "register" &&
      password !== confirmPassword
    ) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const credentials = {
        username: normalizedUsername,
        password,
      };

      const data =
        mode === "login"
          ? await authApi.login(credentials)
          : await authApi.register(credentials);

      onAuthSuccess(data.token, data.user);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Ошибка авторизации"
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    mode,
    username,
    password,
    confirmPassword,
    error,
    loading,
    setMode,
    setUsername,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
}