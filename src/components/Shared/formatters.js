const wholeCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const preciseCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
})

export function formatCurrency(
  value,
  { compact = false, precise = false } = {},
) {
  const numericValue = Number(value) || 0

  if (compact) {
    return compactCurrencyFormatter.format(numericValue)
  }

  if (precise) {
    return preciseCurrencyFormatter.format(numericValue)
  }

  return wholeCurrencyFormatter.format(numericValue)
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value))
}

export function formatPercent(value, digits = 1) {
  if (!Number.isFinite(value)) {
    return '0%'
  }

  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`
}

export function formatMonth(monthKey) {
  if (!monthKey) {
    return 'Current'
  }

  return monthFormatter.format(new Date(`${monthKey}-01`))
}
