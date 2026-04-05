import { MoonStar, ShieldCheck, SunMedium, Wallet2 } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency } from './formatters'

export default function HeaderBar() {
  const { role, setRole, theme, toggleTheme, totalBalance, transactions } =
    useFinance()

  return (
    <header className="section-card hero-banner">
      <div className="hero-banner__copy">
        <span className="eyebrow">Finance dashboard</span>
        <h1>Track money flow with a calm, focused UI.</h1>
        <p>
          Review balances, explore trends, and manage transactions from one
          clean dashboard built for demo-ready frontend portfolios.
        </p>
        <div className="hero-banner__meta">
          <span className="hero-badge">{transactions.length} transactions tracked</span>
          <span className={`hero-badge hero-badge--${role}`}>
            {role === 'viewer'
              ? 'Viewer mode: read only'
              : 'Admin mode: editing enabled'}
          </span>
        </div>
      </div>

      <div className="hero-banner__panel">
        <div className="hero-banner__balance">
          <div className="hero-banner__balance-icon">
            <Wallet2 size={22} />
          </div>
          <div>
            <span>Current balance</span>
            <strong>{formatCurrency(totalBalance)}</strong>
          </div>
        </div>

        <div className="hero-banner__controls">
          <label className="select-field" htmlFor="role-switcher">
            <span>
              <ShieldCheck size={16} />
              Role
            </span>
            <select
              id="role-switcher"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button
            className="icon-button"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
