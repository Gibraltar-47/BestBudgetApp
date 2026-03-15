import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/HomePage';
import { SignupPage } from './pages/SignupPage';
import { BudgetPage } from './pages/BudgetPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DebtTrackerPage } from './pages/DebtTrackerPage';
import { MoneyTreePage } from './pages/MoneyTreePage';
import { SettingsPage } from './pages/SettingsPage';
import { PremiumPage } from './pages/PremiumPage';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/signup', Component: SignupPage },
  { path: '/budget', Component: BudgetPage },
  { path: '/transactions', Component: TransactionsPage },
  { path: '/analytics', Component: AnalyticsPage },
  { path: '/debt-tracker', Component: DebtTrackerPage },
  { path: '/money-tree', Component: MoneyTreePage },
  { path: '/settings', Component: SettingsPage },
  { path: '/premium', Component: PremiumPage },
]);
