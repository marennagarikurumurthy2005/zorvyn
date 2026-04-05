import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FinanceProvider, useFinance } from './context/FinanceContext'
import Home from './pages/Home'

function AppShell() {
  const { theme } = useFinance()

  return (
    <>
      <Home />
      <ToastContainer
        position="top-right"
        autoClose={2400}
        hideProgressBar
        closeButton={false}
        newestOnTop
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </>
  )
}

function App() {
  return (
    <FinanceProvider>
      <AppShell />
    </FinanceProvider>
  )
}

export default App
