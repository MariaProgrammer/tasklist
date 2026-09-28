export default function SortControls({
  sortType,
  sortOrder,
  onSortChange,
}) {
  function direction(type) {
    if (sortType !== type) {
      return "";
    }

    return sortOrder === "asc" ? "↑" : "↓";
  }

  return (
    <div
      className="sort-controls"
      aria-label="Сортировка задач"
    >
      <button
        className={`sort-button ${
          sortType === "date" ? "active" : ""
        }`}
        type="button"
        aria-pressed={sortType === "date"}
        onClick={() => onSortChange("date")}
      >
        По дате {direction("date")}
      </button>

      <button
        className={`sort-button ${
          sortType === "priority" ? "active" : ""
        }`}
        type="button"
        aria-pressed={sortType === "priority"}
        onClick={() => onSortChange("priority")}
      >
        По приоритету {direction("priority")}
      </button>
    </div>
  );
}