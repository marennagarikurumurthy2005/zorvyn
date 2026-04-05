import { useState } from 'react'
import { useFinance } from '../../context/FinanceContext'
import SectionCard from '../Shared/SectionCard'
import TransactionFilters from './TransactionFilters'
import TransactionModal from './TransactionModal'
import TransactionTable from './TransactionTable'

const emptyModalState = {
  isOpen: false,
  mode: 'add',
  transaction: null,
}

export default function TransactionSection() {
  const { deleteTransaction, isViewer } = useFinance()
  const [modalState, setModalState] = useState(emptyModalState)

  const openCreateModal = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      transaction: null,
    })
  }

  const openEditModal = (transaction) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      transaction,
    })
  }

  const closeModal = () => {
    setModalState(emptyModalState)
  }

  const handleDelete = (transaction) => {
    const shouldDelete = window.confirm(
      `Delete "${transaction.description}" from your transactions?`,
    )

    if (!shouldDelete) {
      return
    }

    deleteTransaction(transaction.id)
  }

  return (
    <>
      <SectionCard
        title="Transactions"
        subtitle="Search, filter, and review every transaction in one place"
        className="transaction-panel"
        actions={
          <span className="status-note">
            {isViewer ? 'Viewer mode active' : 'Admin actions enabled'}
          </span>
        }
      >
        <TransactionFilters onAdd={openCreateModal} />
        <TransactionTable
          onAdd={openCreateModal}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </SectionCard>

      {modalState.isOpen ? (
        <TransactionModal
          key={`${modalState.mode}-${modalState.transaction?.id || 'new'}`}
          mode={modalState.mode}
          transaction={modalState.transaction}
          onClose={closeModal}
        />
      ) : null}
    </>
  )
}
