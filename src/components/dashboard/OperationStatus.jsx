export default function OperationStatus({
  isLoading,
  error,
}) {
  let text = "Задачи синхронизированы с сервером";
  let className = "";

  if (isLoading) {
    text = "Загрузка задач...";
  } else if (error) {
    text = error;
    className = "status-error";
  }

  return (
    <div
      className="status-bar"
      role={error ? "alert" : "status"}
      aria-live="polite"
    >
      <span className={className}>{text}</span>
    </div>
  );
}