import { useAuthForm } from "../hooks/useAuthForm";
import AuthForm from "./auth/AuthForm";
import AuthIntro from "./auth/AuthIntro";
import Footer from "./Footer";

export default function AuthPage({
  onAuthSuccess,
  initialError = "",
}) {
  const form = useAuthForm({
    onAuthSuccess,
    initialError,
  });

  return (
    <div className="auth-page">
      <main className="auth-layout">
        <AuthIntro />

        <AuthForm
          mode={form.mode}
          username={form.username}
          password={form.password}
          confirmPassword={form.confirmPassword}
          error={form.error}
          loading={form.loading}
          onModeChange={form.setMode}
          onUsernameChange={form.setUsername}
          onPasswordChange={form.setPassword}
          onConfirmPasswordChange={
            form.setConfirmPassword
          }
          onSubmit={form.handleSubmit}
        />
      </main>

      <Footer />
    </div>
  );
}