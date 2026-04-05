import BalanceTrendChart from './BalanceTrendChart'
import ExpenseBreakdownChart from './ExpenseBreakdownChart'
import SummaryCards from './SummaryCards'

export default function OverviewSection() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Overview</span>
          <h2>Financial snapshot</h2>
          <p>
            High-level totals and a quick visual read on how the last few months
            are moving.
          </p>
        </div>
      </div>

      <SummaryCards />

      <div className="overview-grid">
        <BalanceTrendChart />
        <ExpenseBreakdownChart />
      </div>
    </section>
  )
}
