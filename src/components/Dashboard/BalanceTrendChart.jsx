import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LineChart as LineChartIcon } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import EmptyState from '../Shared/EmptyState'
import SectionCard from '../Shared/SectionCard'
import { formatCurrency, formatMonth } from '../Shared/formatters'

function renderTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0].payload

  return (
    <div className="chart-tooltip">
      <strong>{formatMonth(label)}</strong>
      <span>Balance: {formatCurrency(point.balance)}</span>
      <span>Income: {formatCurrency(point.income)}</span>
      <span>Expenses: {formatCurrency(point.expense)}</span>
    </div>
  )
}

export default function BalanceTrendChart() {
  const { trendData } = useFinance()
  const latestPoint = trendData.at(-1)

  return (
    <SectionCard
      title="Balance trend"
      subtitle="Running monthly balance based on the current dataset"
      className="chart-card"
    >
      {trendData.length === 0 ? (
        <EmptyState
          icon={LineChartIcon}
          title="No chart data yet"
          description="Add a few transactions to see your monthly balance trend."
        />
      ) : (
        <>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.32} />
                    <stop
                      offset="95%"
                      stopColor="var(--accent)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  axisLine={false}
                  tickLine={false}
                  dataKey="month"
                  tickFormatter={formatMonth}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value, { compact: true })}
                />
                <Tooltip content={renderTooltip} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--accent)"
                  fill="url(#balanceFill)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {latestPoint ? (
            <div className="chart-meta">
              <div>
                <span>Latest month</span>
                <strong>{formatMonth(latestPoint.month)}</strong>
              </div>
              <div>
                <span>Income</span>
                <strong>{formatCurrency(latestPoint.income)}</strong>
              </div>
              <div>
                <span>Expenses</span>
                <strong>{formatCurrency(latestPoint.expense)}</strong>
              </div>
            </div>
          ) : null}
        </>
      )}
    </SectionCard>
  )
}
