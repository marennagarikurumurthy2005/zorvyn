import { PieChart as PieChartIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useFinance } from '../../context/FinanceContext'
import EmptyState from '../Shared/EmptyState'
import SectionCard from '../Shared/SectionCard'
import { formatCurrency } from '../Shared/formatters'

function renderTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0].payload

  return (
    <div className="chart-tooltip">
      <strong>{point.name}</strong>
      <span>{formatCurrency(point.value, { precise: true })}</span>
    </div>
  )
}

export default function ExpenseBreakdownChart() {
  const { expenseBreakdown, totalExpenses } = useFinance()

  return (
    <SectionCard
      title="Expense breakdown"
      subtitle="Which categories consume most of your monthly spend"
      className="chart-card"
    >
      {expenseBreakdown.length === 0 ? (
        <EmptyState
          icon={PieChartIcon}
          title="No expenses yet"
          description="Expense categories will appear here once you add spending entries."
        />
      ) : (
        <div className="breakdown-layout">
          <div className="chart-wrap chart-wrap--compact">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip content={renderTooltip} />
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={3}
                >
                  {expenseBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center-note">
              <span>Total spend</span>
              <strong>{formatCurrency(totalExpenses)}</strong>
            </div>
          </div>

          <div className="legend-list">
            {expenseBreakdown.map((entry) => {
              const percentage =
                totalExpenses > 0 ? (entry.value / totalExpenses) * 100 : 0

              return (
                <div className="legend-item" key={entry.name}>
                  <div className="legend-item__label">
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.name}</span>
                  </div>
                  <div className="legend-item__value">
                    <strong>{formatCurrency(entry.value)}</strong>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </SectionCard>
  )
}
