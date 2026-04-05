import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useFinance } from '../../context/FinanceContext'

function createEmptyFormState() {
  return {
    description: '',
    category: '',
    type: 'expense',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  }
}

export default function TransactionModal({ mode, transaction, onClose }) {
  const { addTransaction, updateTransaction } = useFinance()
  const [formState, setFormState] = useState(() =>
    transaction
      ? {
          description: transaction.description,
          category: transaction.category,
          type: transaction.type,
          amount: String(transaction.amount),
          date: transaction.date,
        }
      : createEmptyFormState(),
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormState((currentFormState) => ({
      ...currentFormState,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (formState.description.trim().length < 3) {
      nextErrors.description = 'Enter a short description'
    }

    if (!formState.category.trim()) {
      nextErrors.category = 'Category is required'
    }

    if (!formState.date) {
      nextErrors.date = 'Date is required'
    }

    if (!formState.amount || Number(formState.amount) <= 0) {
      nextErrors.amount = 'Amount must be greater than zero'
    }

    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateForm()

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const payload = {
      ...formState,
      description: formState.description.trim(),
      category: formState.category.trim(),
      amount: Number(formState.amount),
    }

    if (mode === 'edit' && transaction) {
      updateTransaction(transaction.id, payload)
    } else {
      addTransaction(payload)
    }

    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">Transaction</span>
            <h3 id="transaction-modal-title">
              {mode === 'edit' ? 'Edit transaction' : 'Add transaction'}
            </h3>
            <p>
              {mode === 'edit'
                ? 'Update the selected transaction details.'
                : 'Create a new income or expense record.'}
            </p>
          </div>

          <button
            className="icon-button icon-button--soft"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field-group">
              <span>Description</span>
              <input
                name="description"
                type="text"
                placeholder="e.g. Freelance payment"
                value={formState.description}
                onChange={handleChange}
              />
              {errors.description ? (
                <small className="field-error">{errors.description}</small>
              ) : null}
            </label>

            <label className="field-group">
              <span>Category</span>
              <input
                name="category"
                type="text"
                placeholder="e.g. Groceries"
                value={formState.category}
                onChange={handleChange}
              />
              {errors.category ? (
                <small className="field-error">{errors.category}</small>
              ) : null}
            </label>

            <label className="field-group">
              <span>Type</span>
              <select name="type" value={formState.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            <label className="field-group">
              <span>Amount</span>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formState.amount}
                onChange={handleChange}
              />
              {errors.amount ? (
                <small className="field-error">{errors.amount}</small>
              ) : null}
            </label>

            <label className="field-group field-group--full">
              <span>Date</span>
              <input
                name="date"
                type="date"
                value={formState.date}
                onChange={handleChange}
              />
              {errors.date ? (
                <small className="field-error">{errors.date}</small>
              ) : null}
            </label>
          </div>

          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              {mode === 'edit' ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
