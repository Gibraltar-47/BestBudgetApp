import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { User, BudgetTemplate, Transaction, Debt } from '../types';
import { users, budgetTemplates, fatimaTransactions, edwardTransactions, debts } from '../data/mockData';

const MIN_MONTH = new Date(2026, 0, 1);
const MAX_MONTH = new Date(2026, 2, 1);

type Language = 'en' | 'fr';
type Theme = 'light' | 'dark';
type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP';

const translations = {
  en: {
    budget: 'Budget',
    transactions: 'Transactions',
    analytics: 'Analytics',
    debtTracker: 'Debt Tracker',
    settings: 'Settings',
    premium: 'Premium',
    myBudgets: 'My budgets',
    addBudget: 'Add a budget',
    signOut: 'Sign out',
    accountSettings: 'Account Settings',
    welcomeBack: 'Welcome Back!',
    createAccount: 'Create Account',
  },
  fr: {
    budget: 'Budget',
    transactions: 'Transactions',
    analytics: 'Analyses',
    debtTracker: 'Suivi des dettes',
    settings: 'Paramètres',
    premium: 'Premium',
    myBudgets: 'Mes budgets',
    addBudget: 'Ajouter un budget',
    signOut: 'Déconnexion',
    accountSettings: 'Paramètres du compte',
    welcomeBack: 'Bon retour !',
    createAccount: 'Créer un compte',
  },
} as const;

interface AppContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  signup: (userData: Partial<User>) => boolean;
  budgetTemplates: BudgetTemplate[];
  currentBudget: BudgetTemplate | null;
  setCurrentBudget: (budget: BudgetTemplate | null) => void;
  updateBudget: (id: string, updates: Partial<BudgetTemplate>) => void;
  addBudget: () => BudgetTemplate | null;
  transactions: Transaction[];
  debts: Debt[];
  theme: Theme;
  language: Language;
  currency: CurrencyCode;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setCurrency: (currency: CurrencyCode) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  addDebt: (debt: Omit<Debt, 'id' | 'userId' | 'paidAmount'>) => void;
  formatCurrency: (value: number) => string;
  t: (key: keyof typeof translations.en) => string;
  minMonth: Date;
  maxMonth: Date;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const clampMonth = (date: Date) => {
  const monthDate = new Date(date.getFullYear(), date.getMonth(), 1);
  if (monthDate < MIN_MONTH) return new Date(MIN_MONTH);
  if (monthDate > MAX_MONTH) return new Date(MAX_MONTH);
  return monthDate;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allBudgets, setAllBudgets] = useState<BudgetTemplate[]>(budgetTemplates);
  const [currentBudget, setCurrentBudget] = useState<BudgetTemplate | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([...fatimaTransactions, ...edwardTransactions]);
  const [allDebts, setAllDebts] = useState<Debt[]>(debts);
  const [theme, setThemeState] = useState<Theme>((localStorage.getItem('theme') as Theme) || 'light');
  const [language, setLanguageState] = useState<Language>((localStorage.getItem('language') as Language) || 'en');
  const [currency, setCurrencyState] = useState<CurrencyCode>((localStorage.getItem('currency') as CurrencyCode) || 'CAD');
  const [currentMonth, setCurrentMonthState] = useState<Date>(clampMonth(new Date(2026, 2, 14)));
  const [usersList] = useState<User[]>(users);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.style.backgroundColor = theme === 'dark' ? '#0f172a' : '#e5e7eb';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setCurrentBudget(null);
      return;
    }
    const selected = currentBudget ? allBudgets.find((b) => b.id === currentBudget.id) : null;
    const fallback = allBudgets.find((b) => b.userId === currentUser.id || b.collaborators.some((name) => name.includes(currentUser.firstName)));
    setCurrentBudget(selected || fallback || null);
  }, [allBudgets, currentUser]);

  const login = (username: string, password: string): boolean => {
    const user = usersList.find((u) => u.username === username && u.password === password);
    if (!user) return false;
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentBudget(null);
    localStorage.removeItem('currentUser');
  };

  const signup = (_userData: Partial<User>): boolean => true;

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setAllTransactions((prev) => [{ ...transaction, id: `txn-${currentUser?.id || 'x'}-${Date.now()}` }, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setAllTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setAllTransactions((prev) => prev.map((transaction) => (transaction.id === id ? { ...transaction, ...updates } : transaction)));
  };

  const updateBudget = (id: string, updates: Partial<BudgetTemplate>) => {
    setAllBudgets((prev) => prev.map((budget) => (budget.id === id ? { ...budget, ...updates } : budget)));
  };

  const addBudget = () => {
    if (!currentUser) return null;
    const budget: BudgetTemplate = {
      id: `budget-${Date.now()}`,
      userId: currentUser.id,
      title: 'Untitled',
      monthlyBudget: 0,
      period: 'monthly',
      startDate: '2026-01-15',
      endDate: '2026-03-18',
      collaborators: [],
      categories: [],
    };
    setAllBudgets((prev) => [budget, ...prev]);
    setCurrentBudget(budget);
    return budget;
  };

  const addDebt = (debt: Omit<Debt, 'id' | 'userId' | 'paidAmount'>) => {
    if (!currentUser) return;
    setAllDebts((prev) => [
      {
        ...debt,
        id: `debt-${Date.now()}`,
        userId: currentUser.id,
        paidAmount: Math.max(0, debt.totalAmount - debt.remainingAmount),
      },
      ...prev,
    ]);
  };

  const userBudgets = useMemo(
    () =>
      currentUser
        ? allBudgets.filter((b) => b.userId === currentUser.id || b.collaborators.some((name) => name.includes(currentUser.firstName)))
        : [],
    [allBudgets, currentUser],
  );

  const userTransactions = useMemo(() => {
    if (!currentUser) return [];
    return allTransactions.filter((transaction) => {
      if (currentUser.id === '1') {
        return fatimaTransactions.some((base) => base.id === transaction.id) || transaction.id.startsWith(`txn-${currentUser.id}-`);
      }
      return edwardTransactions.some((base) => base.id === transaction.id) || transaction.id.startsWith(`txn-${currentUser.id}-`);
    });
  }, [allTransactions, currentUser]);

  const userDebts = useMemo(() => {
    if (!currentUser) return [];
    return allDebts.filter((debtItem) => debtItem.userId === currentUser.id);
  }, [allDebts, currentUser]);

  const locale = language === 'fr' ? 'fr-CA' : 'en-CA';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);

  const t = (key: keyof typeof translations.en) => translations[language][key];

  const setTheme = (nextTheme: Theme) => setThemeState(nextTheme);
  const setLanguage = (nextLanguage: Language) => setLanguageState(nextLanguage);
  const setCurrency = (nextCurrency: CurrencyCode) => setCurrencyState(nextCurrency);
  const setCurrentMonth = (date: Date) => setCurrentMonthState(clampMonth(date));

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        signup,
        budgetTemplates: userBudgets,
        currentBudget,
        setCurrentBudget,
        updateBudget,
        addBudget,
        transactions: userTransactions,
        debts: userDebts,
        theme,
        language,
        currency,
        setTheme,
        setLanguage,
        setCurrency,
        currentMonth,
        setCurrentMonth,
        updateUserProfile,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addDebt,
        formatCurrency,
        t,
        minMonth: new Date(MIN_MONTH),
        maxMonth: new Date(MAX_MONTH),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
