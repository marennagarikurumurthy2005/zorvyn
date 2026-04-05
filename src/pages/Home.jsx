import OverviewSection from '../components/Dashboard/OverviewSection'
import InsightsSection from '../components/Insights/InsightsSection'
import HeaderBar from '../components/Shared/HeaderBar'
import TransactionSection from '../components/Transactions/TransactionSection'

export default function Home() {
  return (
    <main className="app-shell">
      <div className="page-stack">
        <HeaderBar />
        <OverviewSection />

        <div className="page-layout">
          <div className="page-layout__primary">
            <TransactionSection />
          </div>
          <div className="page-layout__secondary">
            <InsightsSection />
          </div>
        </div>
      </div>
    </main>
  )
}
