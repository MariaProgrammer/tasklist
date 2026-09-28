export default function CollapsiblePanel({
  title,
  isOpen,
  onToggle,
  children,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>

        <button
          className="icon-button"
          type="button"
          aria-expanded={isOpen}
          aria-label={
            isOpen
              ? `Свернуть раздел «${title}»`
              : `Развернуть раздел «${title}»`
          }
          onClick={onToggle}
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {isOpen && children}
    </section>
  );
}