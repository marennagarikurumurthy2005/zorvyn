import {
  ArrowDownRight,
  ArrowUpRight,
  FileSearch,
  PencilLine,
  Trash2,
} from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'
import EmptyState from '../Shared/EmptyState'
import { formatCurrency, formatDate } from '../Shared/formatters'

export default function TransactionTable({ onAdd, onEdit, onDelete }) {
  const {
    filteredTransactions,
    hasActiveFilters,
    hasTransactions,
    isViewer,
    resetFilters,
  } = useFinance()

  if (filteredTransactions.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        title={hasTransactions ? 'No matching transactions' : 'No transactions yet'}
        description={
          hasTransactions
            ? 'Try adjusting your filters or search query.'
            : 'Add your first transaction to start tracking income and expenses.'
        }
        actionLabel={
          hasTransactions
            ? hasActiveFilters
              ? 'Reset filters'
              : undefined
            : !isViewer
              ? 'Add transaction'
              : undefined
        }
        onAction={hasTransactions ? resetFilters : onAdd}
      />
    )
  }

  return (
    <div className="transaction-list">
      <div
        className={`transaction-list__head ${
          isViewer ? 'transaction-list__head--viewer' : ''
        }`}
      >
        <span>Date</span>
        <span>Details</span>
        <span>Category</span>
        <span>Type</span>
        <span>Amount</span>
        {!isViewer ? <span>Actions</span> : null}
      </div>

      {filteredTransactions.map((transaction) => {
        const isIncome = transaction.type === 'income'

        return (
          <article
            className={`transaction-row ${
              isViewer ? 'transaction-row--viewer' : ''
            }`}
            key={transaction.id}
          >
            <div className="transaction-cell" data-label="Date">
              <span className="transaction-cell__value">
                {formatDate(transaction.date)}
              </span>
            </div>

            <div className="transaction-cell" data-label="Details">
              <div className="transaction-row__details">
                <span className="transaction-row__title">
                  {transaction.description}
                </span>
                <span className="transaction-row__meta">
                  {isIncome ? 'Income source' : 'Expense entry'}
                </span>
              </div>
            </div>

            <div className="transaction-cell" data-label="Category">
              <span className="category-pill">{transaction.category}</span>
            </div>

            <div className="transaction-cell" data-label="Type">
              <span
                className={`type-pill ${
                  isIncome ? 'type-pill--income' : 'type-pill--expense'
                }`}
              >
                {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {isIncome ? 'Income' : 'Expense'}
              </span>
            </div>

            <div className="transaction-cell" data-label="Amount">
              <span
                className={`transaction-amount ${
                  isIncome
                    ? 'transaction-amount--income'
                    : 'transaction-amount--expense'
                }`}
              >
                {isIncome ? '+' : '-'}
                {formatCurrency(transaction.amount, { precise: true }).replace('-', '')}
              </span>
            </div>

            {!isViewer ? (
              <div className="transaction-cell" data-label="Actions">
                <div className="transaction-row__actions">
                  <button
                    className="icon-button icon-button--soft"
                    type="button"
                    onClick={() => onEdit(transaction)}
                    aria-label={`Edit ${transaction.description}`}
                  >
                    <PencilLine size={16} />
                  </button>
                  <button
                    className="icon-button icon-button--soft icon-button--danger"
                    type="button"
                    onClick={() => onDelete(transaction)}
                    aria-label={`Delete ${transaction.description}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}
