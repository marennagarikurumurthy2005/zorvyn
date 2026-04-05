export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {Icon ? <Icon size={24} /> : null}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <button className="ghost-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
