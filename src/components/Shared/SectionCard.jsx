export default function SectionCard({
  title,
  subtitle,
  actions,
  className = '',
  children,
}) {
  const cardClassName = ['section-card', className].filter(Boolean).join(' ')

  return (
    <section className={cardClassName}>
      {(title || subtitle || actions) && (
        <div className="section-card__header">
          <div className="section-card__heading">
            {title ? <h3>{title}</h3> : null}
            {subtitle ? <p className="section-card__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="section-card__actions">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  )
}
