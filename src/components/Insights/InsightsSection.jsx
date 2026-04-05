import {
  BadgeDollarSign,
  PiggyBank,
  TrendingDown,
  WalletCards,
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import SectionCard from '../Shared/SectionCard'
import {
  formatCurrency,
  formatDate,
  formatMonth,
  formatPercent,
} from '../Shared/formatters'

export default function InsightsSection() {
  const {
    averageExpenseValue,
    biggestExpense,
    currentMonthStats,
    expenseChange,
    highestSpendingCategory,
    latestMonthKey,
    previousMonthKey,
    previousMonthStats,
    savingsRate,
  } = useFinance()

  const comparisonMax = Math.max(
    currentMonthStats.expense,
    previousMonthStats.expense,
    1,
  )

  return (
    <SectionCard
      title="Insights"
      subtitle="Small data reads that help the dashboard feel more actionable"
      className="insights-panel"
    >
      <div className="insights-grid">
        <article className="insight-card">
          <div className="insight-card__icon">
            <BadgeDollarSign size={18} />
          </div>
          <span className="insight-card__label">Highest spend category</span>
          <strong className="insight-card__value">
            {highestSpendingCategory?.name || 'No expense data'}
          </strong>
          <p className="insight-card__text">
            {highestSpendingCategory
              ? `${formatCurrency(highestSpendingCategory.value)} spent here so far.`
              : 'Expense categories will appear after you record spend.'}
          </p>
        </article>

        <article className="insight-card">
          <div className="insight-card__icon">
            <TrendingDown size={18} />
          </div>
          <span className="insight-card__label">Monthly comparison</span>
          <strong className="insight-card__value">{formatPercent(expenseChange)}</strong>
          <p className="insight-card__text">
            Expense change from {formatMonth(previousMonthKey)} to{' '}
            {formatMonth(latestMonthKey)}.
          </p>
          <div className="compare-bars">
            <div className="compare-bars__item">
              <div className="compare-bars__meta">
                <span>{formatMonth(previousMonthKey)}</span>
                <strong>{formatCurrency(previousMonthStats.expense)}</strong>
              </div>
              <div className="meter">
                <span
                  style={{
                    width: `${(previousMonthStats.expense / comparisonMax) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="compare-bars__item">
              <div className="compare-bars__meta">
                <span>{formatMonth(latestMonthKey)}</span>
                <strong>{formatCurrency(currentMonthStats.expense)}</strong>
              </div>
              <div className="meter meter--accent">
                <span
                  style={{
                    width: `${(currentMonthStats.expense / comparisonMax) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </article>

        <article className="insight-card">
          <div className="insight-card__icon">
            <PiggyBank size={18} />
          </div>
          <span className="insight-card__label">Savings rate</span>
          <strong className="insight-card__value">{formatPercent(savingsRate)}</strong>
          <p className="insight-card__text">
            Based on {formatMonth(latestMonthKey)} income versus expenses.
          </p>
          <div className="meter meter--success">
            <span style={{ width: `${Math.max(Math.min(savingsRate, 100), 0)}%` }} />
          </div>
        </article>

        <article className="insight-card">
          <div className="insight-card__icon">
            <WalletCards size={18} />
          </div>
          <span className="insight-card__label">Largest expense</span>
          <strong className="insight-card__value">
            {biggestExpense ? formatCurrency(biggestExpense.amount) : 'No expense data'}
          </strong>
          <p className="insight-card__text">
            {biggestExpense
              ? `${biggestExpense.description} on ${formatDate(biggestExpense.date)}`
              : 'Add expenses to surface your biggest outflow.'}
          </p>
          <small className="insight-card__subtle">
            Avg expense: {formatCurrency(averageExpenseValue)}
          </small>
        </article>
      </div>
    </SectionCard>
  )
}
