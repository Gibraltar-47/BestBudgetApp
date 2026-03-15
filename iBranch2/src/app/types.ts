export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plan: 'basic' | 'premium';
  dateOfBirth?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  expectedAmount: number;
  spentAmount: number;
  percentage: number;
  subCategories?: string[];
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  subCategory?: string;
  recurring?: boolean;
}

export interface Debt {
  id: string;
  userId?: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  paidAmount: number;
  interestRate: number;
  minimumPayment: number;
  maximumPayment?: number;
  period: string;
  paymentFrequency?: 'weekly' | 'biweekly' | 'monthly';
}

export interface BudgetTemplate {
  id: string;
  userId: string;
  title: string;
  monthlyBudget: number;
  period: 'weekly' | 'biweekly' | 'monthly';
  startDate: string;
  endDate?: string;
  categories: Category[];
  collaborators: string[];
}

export interface MoneyTreeLevel {
  level: number;
  target: number;
  reached: boolean;
}
