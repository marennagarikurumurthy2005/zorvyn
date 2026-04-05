import { CirclePlus, RotateCcw, Search } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'

export default function TransactionFilters({ onAdd }) {
  const {
    categories,
    filters,
    hasActiveFilters,
    isViewer,
    updateFilters,
    resetFilters,
  } = useFinance()

  return (
    <div className="transaction-toolbar">
      <label className="search-input" htmlFor="transaction-search">
        <Search size={18} />
        <input
          id="transaction-search"
          type="search"
          placeholder="Search by description, category, or amount"
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
        />
      </label>

      <div className="toolbar-controls">
        <label className="select-field" htmlFor="transaction-type-filter">
          <span>Type</span>
          <select
            id="transaction-type-filter"
            value={filters.type}
            onChange={(event) => updateFilters({ type: event.target.value })}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="select-field" htmlFor="transaction-category-filter">
          <span>Category</span>
          <select
            id="transaction-category-filter"
            value={filters.category}
            onChange={(event) => updateFilters({ category: event.target.value })}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="select-field" htmlFor="transaction-sort-filter">
          <span>Sort</span>
          <select
            id="transaction-sort-filter"
            value={filters.sortBy}
            onChange={(event) => updateFilters({ sortBy: event.target.value })}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </label>

        <button
          className="ghost-button"
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          <RotateCcw size={16} />
          Clear
        </button>

        {!isViewer ? (
          <button className="primary-button" type="button" onClick={onAdd}>
            <CirclePlus size={18} />
            Add transaction
          </button>
        ) : null}
      </div>
    </div>
  )
}
