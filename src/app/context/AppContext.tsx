import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { User, BudgetTemplate, Transaction, Debt } from '../types';
import { users, budgetTemplates, fatimaTransactions, edwardTransactions, debts } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  signup: (userData: Partial<User>) => boolean;
  budgetTemplates: BudgetTemplate[];
  currentBudget: BudgetTemplate | null;
  setCurrentBudget: (budget: BudgetTemplate | null) => void;
  transactions: Transaction[];
  debts: Debt[];
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
  currency: string;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'fr') => void;
  setCurrency: (currency: string) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  updateBudget: (budgetId: string, updates: Partial<BudgetTemplate>) => void;
  addBudget: (budget: Omit<BudgetTemplate, 'id'>) => void;
  addCollaborator: (budgetId: string, collaboratorName: string) => { ok: boolean; message?: string };
  removeCollaborator: (budgetId: string, collaboratorName: string) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const DEFAULT_MONTH = new Date(2026, 2, 1);

const getSettingsKey = (userId: string) => `ibudget_settings_${userId}`;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allBudgets, setAllBudgets] = useState<BudgetTemplate[]>(budgetTemplates);
  const [currentBudget, setCurrentBudget] = useState<BudgetTemplate | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([...fatimaTransactions, ...edwardTransactions]);
  const [allDebts, setAllDebts] = useState<Debt[]>(debts);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [currency, setCurrency] = useState<string>('CAD');
  const [currentMonth, setCurrentMonth] = useState<Date>(DEFAULT_MONTH);
  const [usersList] = useState<User[]>(users);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser) as User;
      setCurrentUser(user);
      const settings = localStorage.getItem(getSettingsKey(user.id));
      if (settings) {
        const parsed = JSON.parse(settings);
        setTheme(parsed.theme ?? 'light');
        setLanguage(parsed.language ?? 'en');
        setCurrency(parsed.currency ?? 'CAD');
      }
      const userBudget = budgetTemplates.find((b) => b.userId === user.id);
      if (userBudget) setCurrentBudget(userBudget);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(getSettingsKey(currentUser.id), JSON.stringify({ theme, language, currency }));
    }
  }, [theme, language, currency, currentUser]);

  const login = (username: string, password: string): boolean => {
    const user = usersList.find((u) => u.username === username && u.password === password);
    if (!user) return false;
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    const settings = localStorage.getItem(getSettingsKey(user.id));
    if (settings) {
      const parsed = JSON.parse(settings);
      setTheme(parsed.theme ?? 'light');
      setLanguage(parsed.language ?? 'en');
      setCurrency(parsed.currency ?? 'CAD');
    } else {
      setTheme('light');
      setLanguage('en');
      setCurrency('CAD');
    }
    setCurrentMonth(DEFAULT_MONTH);
    const userBudget = allBudgets.find((b) => b.userId === user.id) ?? null;
    setCurrentBudget(userBudget);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentBudget(null);
    setTheme('light');
    setLanguage('en');
    setCurrency('CAD');
    setCurrentMonth(DEFAULT_MONTH);
    localStorage.removeItem('currentUser');
  };

  const signup = (_userData: Partial<User>) => true;

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const prefix = currentUser?.id === '1' ? 't' : 'e';
    const newTransaction = { ...transaction, id: `${prefix}_new_${Date.now()}` };
    setAllTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => setAllTransactions((prev) => prev.filter((t) => t.id !== id));
  const updateTransaction = (id: string, updates: Partial<Transaction>) => setAllTransactions((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));

  const updateBudget = (budgetId: string, updates: Partial<BudgetTemplate>) => {
    setAllBudgets((prev) => prev.map((b) => b.id === budgetId ? { ...b, ...updates } : b));
    if (currentBudget?.id === budgetId) setCurrentBudget((prev) => prev ? { ...prev, ...updates } : prev);
  };

  const addBudget = (budget: Omit<BudgetTemplate, 'id'>) => {
    const newBudget = { ...budget, id: `budget_${Date.now()}` };
    setAllBudgets((prev) => [...prev, newBudget]);
    setCurrentBudget(newBudget);
  };

  const addCollaborator = (budgetId: string, collaboratorName: string) => {
    const target = allBudgets.find((b) => b.id === budgetId);
    if (!target || !currentUser) return { ok: false };
    if (currentUser.plan !== 'premium' && target.collaborators.length >= 1) {
      return { ok: false, message: 'Basic plans include 1 collaborator. Upgrade to Premium for unlimited collaborators.' };
    }
    if (target.collaborators.includes(collaboratorName)) return { ok: true };
    updateBudget(budgetId, { collaborators: [...target.collaborators, collaboratorName] });
    return { ok: true };
  };

  const removeCollaborator = (budgetId: string, collaboratorName: string) => {
    const target = allBudgets.find((b) => b.id === budgetId);
    if (!target) return;
    updateBudget(budgetId, { collaborators: target.collaborators.filter((c) => c !== collaboratorName) });
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => setAllDebts((prev) => [...prev, { ...debt, id: `debt_${Date.now()}` }]);
  const updateDebt = (id: string, updates: Partial<Debt>) => setAllDebts((prev) => prev.map((d) => d.id === id ? { ...d, ...updates } : d));
  const deleteDebt = (id: string) => setAllDebts((prev) => prev.filter((d) => d.id !== id));

  const userBudgets = useMemo(() => currentUser
    ? allBudgets.filter((b) => b.userId === currentUser.id || b.collaborators.some((c) => c.includes(currentUser.firstName)))
    : [], [allBudgets, currentUser]);

  const userTransactions = useMemo(() => {
    if (!currentUser) return [];
    const prefixes = currentUser.id === '1' ? ['t'] : ['e'];
    return allTransactions.filter((t) => prefixes.some((prefix) => t.id.startsWith(prefix)));
  }, [allTransactions, currentUser]);

  const userDebts = useMemo(() => {
    if (!currentUser) return [];
    return allDebts.filter((d) => !d.userId || d.userId === currentUser.id);
  }, [allDebts, currentUser]);

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      signup,
      budgetTemplates: userBudgets,
      currentBudget,
      setCurrentBudget,
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
      updateBudget,
      addBudget,
      addCollaborator,
      removeCollaborator,
      addDebt,
      updateDebt,
      deleteDebt,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
