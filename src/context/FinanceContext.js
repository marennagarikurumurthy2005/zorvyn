import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import { chartPalette, defaultFilters, mockTransactions } from '../data/mockData'

const FinanceContext = createContext(null)

const STORAGE_KEYS = {
  transactions: 'finance-dashboard-transactions',
  role: 'finance-dashboard-role',
  theme: 'finance-dashboard-theme',
}

function readStoredJson(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

function readStoredString(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  return window.localStorage.getItem(key) || fallback
}

function normalizeTransaction(transaction) {
  return {
    ...transaction,
    description: transaction.description?.trim() || '',
    category: transaction.category?.trim() || '',
    type: transaction.type === 'income' ? 'income' : 'expense',
    amount: Number(transaction.amount) || 0,
  }
}

function getMonthKey(dateValue) {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

function compareTransactions(firstTransaction, secondTransaction, sortBy) {
  if (sortBy === 'amount-asc') {
    return firstTransaction.amount - secondTransaction.amount
  }

  if (sortBy === 'amount-desc') {
    return secondTransaction.amount - firstTransaction.amount
  }

  if (sortBy === 'date-asc') {
    return new Date(firstTransaction.date) - new Date(secondTransaction.date)
  }

  return new Date(secondTransaction.date) - new Date(firstTransaction.date)
}

function createTransactionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `txn-${Date.now()}`
}

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = readStoredJson(STORAGE_KEYS.transactions, null)

    if (Array.isArray(storedTransactions)) {
      return storedTransactions.map(normalizeTransaction)
    }

    return mockTransactions.map(normalizeTransaction)
  })
  const [filters, setFilters] = useState(defaultFilters)
  const [role, setRoleState] = useState(() =>
    readStoredString(STORAGE_KEYS.role, 'admin'),
  )
  const [theme, setTheme] = useState(() =>
    readStoredString(STORAGE_KEYS.theme, 'light'),
  )

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.transactions,
      JSON.stringify(transactions),
    )
  }, [transactions])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.role, role)
  }, [role])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.theme, theme)
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const updateFilters = (nextFilters) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
    }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  const setRole = (nextRole) => {
    setRoleState(nextRole === 'viewer' ? 'viewer' : 'admin')
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  const addTransaction = (transaction) => {
    const nextTransaction = normalizeTransaction({
      ...transaction,
      id: createTransactionId(),
    })

    setTransactions((currentTransactions) => [
      nextTransaction,
      ...currentTransactions,
    ])
    toast.success('Transaction added successfully')
  }

  const updateTransaction = (transactionId, transaction) => {
    setTransactions((currentTransactions) =>
      currentTransactions.map((currentTransaction) =>
        currentTransaction.id === transactionId
          ? normalizeTransaction({
              ...currentTransaction,
              ...transaction,
              id: transactionId,
            })
          : currentTransaction,
      ),
    )
    toast.success('Transaction updated successfully')
  }

  const deleteTransaction = (transactionId) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (currentTransaction) => currentTransaction.id !== transactionId,
      ),
    )
    toast.success('Transaction deleted successfully')
  }

  const searchQuery = filters.search.trim().toLowerCase()
  const filteredTransactions = [...transactions]
    .filter((transaction) => {
      const matchesSearch =
        !searchQuery ||
        transaction.description.toLowerCase().includes(searchQuery) ||
        transaction.category.toLowerCase().includes(searchQuery) ||
        String(transaction.amount).includes(searchQuery)

      const matchesType =
        filters.type === 'all' || transaction.type === filters.type
      const matchesCategory =
        filters.category === 'all' || transaction.category === filters.category

      return matchesSearch && matchesType && matchesCategory
    })
    .sort((firstTransaction, secondTransaction) =>
      compareTransactions(firstTransaction, secondTransaction, filters.sortBy),
    )

  const categories = [...new Set(transactions.map((transaction) => transaction.category))]
    .filter(Boolean)
    .sort((firstCategory, secondCategory) =>
      firstCategory.localeCompare(secondCategory),
    )

  const totalIncome = transactions.reduce(
    (sum, transaction) =>
      transaction.type === 'income' ? sum + transaction.amount : sum,
    0,
  )
  const totalExpenses = transactions.reduce(
    (sum, transaction) =>
      transaction.type === 'expense' ? sum + transaction.amount : sum,
    0,
  )
  const totalBalance = totalIncome - totalExpenses

  const monthKeys = [
    ...new Set(
      transactions
        .map((transaction) => getMonthKey(transaction.date))
        .filter(Boolean),
    ),
  ].sort(
    (firstMonth, secondMonth) =>
      new Date(`${firstMonth}-01`) - new Date(`${secondMonth}-01`),
  )

  const monthlyStats = {}

  monthKeys.forEach((monthKey) => {
    monthlyStats[monthKey] = {
      income: 0,
      expense: 0,
    }
  })

  transactions.forEach((transaction) => {
    const monthKey = getMonthKey(transaction.date)

    if (!monthKey) {
      return
    }

    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = {
        income: 0,
        expense: 0,
      }
    }

    if (transaction.type === 'income') {
      monthlyStats[monthKey].income += transaction.amount
    } else {
      monthlyStats[monthKey].expense += transaction.amount
    }
  })

  const trendData = monthKeys.reduce((points, monthKey) => {
    const monthStats = monthlyStats[monthKey] || { income: 0, expense: 0 }
    const previousBalance = points.at(-1)?.balance || 0
    const currentBalance =
      previousBalance + monthStats.income - monthStats.expense

    return [
      ...points,
      {
        month: monthKey,
        balance: Number(currentBalance.toFixed(2)),
        income: Number(monthStats.income.toFixed(2)),
        expense: Number(monthStats.expense.toFixed(2)),
      },
    ]
  }, [])

  const expenseBreakdown = Object.entries(
    transactions.reduce((categoryTotals, transaction) => {
      if (transaction.type !== 'expense') {
        return categoryTotals
      }

      categoryTotals[transaction.category] =
        (categoryTotals[transaction.category] || 0) + transaction.amount

      return categoryTotals
    }, {}),
  )
    .sort((firstCategory, secondCategory) => secondCategory[1] - firstCategory[1])
    .map(([name, value], index) => ({
      name,
      value: Number(value.toFixed(2)),
      color: chartPalette[index % chartPalette.length],
    }))

  const latestMonthKey = monthKeys.at(-1) || ''
  const previousMonthKey = monthKeys.at(-2) || ''
  const currentMonthStats = monthlyStats[latestMonthKey] || {
    income: 0,
    expense: 0,
  }
  const previousMonthStats = monthlyStats[previousMonthKey] || {
    income: 0,
    expense: 0,
  }

  const currentNet = currentMonthStats.income - currentMonthStats.expense
  const previousNet = previousMonthStats.income - previousMonthStats.expense
  const expenseChange =
    previousMonthStats.expense > 0
      ? ((currentMonthStats.expense - previousMonthStats.expense) /
          previousMonthStats.expense) *
        100
      : 0
  const netChange =
    previousNet !== 0
      ? ((currentNet - previousNet) / Math.abs(previousNet)) * 100
      : 0

  const highestSpendingCategory = expenseBreakdown[0] || null
  const biggestExpense = [...transactions]
    .filter((transaction) => transaction.type === 'expense')
    .sort(
      (firstTransaction, secondTransaction) =>
        secondTransaction.amount - firstTransaction.amount,
    )[0] || null

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === 'expense',
  )
  const averageExpenseValue =
    expenseTransactions.length > 0
      ? totalExpenses / expenseTransactions.length
      : 0
  const savingsRate =
    currentMonthStats.income > 0
      ? ((currentMonthStats.income - currentMonthStats.expense) /
          currentMonthStats.income) *
        100
      : 0

  const hasActiveFilters =
    filters.search !== defaultFilters.search ||
    filters.type !== defaultFilters.type ||
    filters.category !== defaultFilters.category ||
    filters.sortBy !== defaultFilters.sortBy

  const value = {
    transactions,
    filteredTransactions,
    filters,
    categories,
    role,
    theme,
    totalIncome,
    totalExpenses,
    totalBalance,
    trendData,
    expenseBreakdown,
    latestMonthKey,
    previousMonthKey,
    currentMonthStats,
    previousMonthStats,
    highestSpendingCategory,
    biggestExpense,
    savingsRate,
    averageExpenseValue,
    expenseChange,
    netChange,
    hasActiveFilters,
    hasTransactions: transactions.length > 0,
    isViewer: role === 'viewer',
    updateFilters,
    resetFilters,
    setRole,
    toggleTheme,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }

  return createElement(FinanceContext.Provider, { value }, children)
}

export function useFinance() {
  const context = useContext(FinanceContext)

  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }

  return context
}
