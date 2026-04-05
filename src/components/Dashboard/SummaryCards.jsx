import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import StatCard from '../Shared/StatCard'
import {
  formatCurrency,
  formatMonth,
  formatPercent,
} from '../Shared/formatters'

export default function SummaryCards() {
  const {
    totalBalance,
    totalIncome,
    totalExpenses,
    currentMonthStats,
    latestMonthKey,
    expenseChange,
    netChange,
  } = useFinance()

  return (
    <div className="stats-grid">
      <StatCard
        icon={Wallet}
        label="Total Balance"
        value={formatCurrency(totalBalance)}
        helper={`Net movement ${formatPercent(netChange)} vs previous month`}
        tone="balance"
      />
      <StatCard
        icon={ArrowUpCircle}
        label={`Income · ${formatMonth(latestMonthKey)}`}
        value={formatCurrency(totalIncome)}
        helper={`${formatCurrency(currentMonthStats.income)} recorded this month`}
        tone="income"
      />
      <StatCard
        icon={ArrowDownCircle}
        label={`Expenses · ${formatMonth(latestMonthKey)}`}
        value={formatCurrency(totalExpenses)}
        helper={`Monthly expense change ${formatPercent(expenseChange)}`}
        tone="expense"
      />
    </div>
  )
}
