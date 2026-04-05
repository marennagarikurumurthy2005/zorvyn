# Finance Dashboard

A responsive finance dashboard built with React, Vite, CSS3, Lucide React, Recharts, and React Toastify. The app is frontend-only, uses mock data by default, and persists local changes with `localStorage`.

## Features

- Dashboard summary cards for total balance, total income, and total expenses
- Balance trend chart and expense breakdown chart powered by Recharts
- Transaction management with search, category/type filters, and sort controls
- Frontend-only role switcher:
  - `Viewer`: read-only mode
  - `Admin`: add, edit, and delete transactions
- Insights cards for:
  - highest spending category
  - monthly expense comparison
  - savings rate
  - largest expense
- Toast notifications for add, edit, and delete actions
- Dark mode toggle
- Persistent transactions, role, and theme with `localStorage`
- Empty states and responsive layout for mobile and desktop

## Tech Stack

- React 19
- Vite
- CSS3
- Lucide React
- Recharts
- React Toastify

## Project Structure

```text
src/
├── components/
│   ├── Dashboard/
│   │   ├── BalanceTrendChart.jsx
│   │   ├── ExpenseBreakdownChart.jsx
│   │   ├── OverviewSection.jsx
│   │   └── SummaryCards.jsx
│   ├── Insights/
│   │   └── InsightsSection.jsx
│   ├── Shared/
│   │   ├── EmptyState.jsx
│   │   ├── HeaderBar.jsx
│   │   ├── SectionCard.jsx
│   │   ├── StatCard.jsx
│   │   └── formatters.js
│   └── Transactions/
│       ├── TransactionFilters.jsx
│       ├── TransactionModal.jsx
│       ├── TransactionSection.jsx
│       └── TransactionTable.jsx
├── context/
│   └── FinanceContext.js
├── data/
│   └── mockData.js
├── pages/
│   └── Home.jsx
├── styles/
│   └── global.css
├── App.jsx
├── index.css
└── main.jsx
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

4. Build for production:

```bash
npm run build
```

## How It Works

### Dashboard Overview

- Summary cards pull totals from the shared finance context.
- The trend chart shows the running balance by month.
- The breakdown chart groups expense transactions by category.

### Transactions

- Search matches description, category, and amount text.
- Filters support transaction type and category.
- Sorting supports amount and date.
- Admin users can open a modal to add or edit transactions.

### Role-Based UI

- Use the header dropdown to switch between `Viewer` and `Admin`.
- `Viewer` mode hides all write actions.
- `Admin` mode enables add, edit, and delete controls.

### Persistence

The app stores these values in `localStorage`:

- transactions
- selected role
- selected theme

## Suggested Demo Flow

1. Start in `Viewer` mode to show the read-only dashboard experience.
2. Switch to `Admin` mode.
3. Add a transaction from the transactions section.
4. Edit an existing transaction to show form prefilling.
5. Delete a transaction and show the success toast.
6. Toggle dark mode to demonstrate polish and persistence.

## Notes

- The app uses static/mock data only.
- No backend setup is required.
- The layout is designed to be portfolio-friendly while staying simple and readable.
