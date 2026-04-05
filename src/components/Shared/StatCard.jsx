export default function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  tone = 'neutral',
}) {
  return (
    <article className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__top">
        <div className="stat-card__icon">{Icon ? <Icon size={20} /> : null}</div>
        <span className="stat-card__label">{label}</span>
      </div>
      <strong className="stat-card__value">{value}</strong>
      {helper ? <p className="stat-card__helper">{helper}</p> : null}
    </article>
  )
}
