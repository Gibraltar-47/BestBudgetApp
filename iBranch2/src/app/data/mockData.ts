import { User, BudgetTemplate, Transaction, Debt } from '../types';

export const users: User[] = [
  {
    id: '1',
    username: 'moneyMaker123',
    password: 'fatimabroke123',
    firstName: 'Fatima',
    lastName: '',
    email: 'fatima@gmail.com',
    phone: '514 123-4567',
    plan: 'basic',
  },
  {
    id: '2',
    username: 'Eddie1997',
    password: 'familyfirst!',
    firstName: 'Edward',
    lastName: '',
    email: 'ed.ward@gmail.com',
    phone: '514 786-9009',
    plan: 'premium',
  },
];

export const budgetTemplates: BudgetTemplate[] = [
  {
    id: 'b1',
    userId: '1',
    title: 'Monthly allowance',
    monthlyBudget: 2000,
    period: 'monthly',
    startDate: '2026-01-01',
    endDate: '2026-03-30',
    collaborators: [],
    categories: [
      {
        id: 'c1',
        name: 'Food',
        color: '#F56BB9',
        icon: 'UtensilsCrossed',
        expectedAmount: 400,
        spentAmount: 186,
        percentage: 20,
        subCategories: ['Coffee', 'Groceries', 'Takeout'],
      },
      {
        id: 'c2',
        name: 'Transport',
        color: '#553666',
        icon: 'Car',
        expectedAmount: 200,
        spentAmount: 43,
        percentage: 10,
        subCategories: ['Transit', 'Ride share', 'Gas'],
      },
      {
        id: 'c3',
        name: 'Savings',
        color: '#399A57',
        icon: 'PiggyBank',
        expectedAmount: 600,
        spentAmount: 278,
        percentage: 30,
        subCategories: ['Emergency', 'Short term'],
      },
      {
        id: 'c4',
        name: 'Personal Expenses',
        color: '#8B5CF6',
        icon: 'ShoppingBag',
        expectedAmount: 600,
        spentAmount: 510,
        percentage: 30,
        subCategories: ['Shopping', 'Self care'],
      },
      {
        id: 'c5',
        name: 'Education',
        color: '#E0A225',
        icon: 'GraduationCap',
        expectedAmount: 200,
        spentAmount: 85,
        percentage: 10,
        subCategories: ['Books', 'Courses', 'Supplies'],
      },
    ],
  },
  {
    id: 'b2',
    userId: '2',
    title: 'Family Budget',
    monthlyBudget: 10000,
    period: 'monthly',
    startDate: '2026-01-01',
    endDate: '2026-03-30',
    collaborators: ['Lucy'],
    categories: [
      {
        id: 'c6',
        name: 'Food',
        color: '#8B5CF6',
        icon: 'UtensilsCrossed',
        expectedAmount: 1200,
        spentAmount: 896,
        percentage: 12,
        subCategories: ['Coffee', 'Groceries', 'Dining'],
      },
      {
        id: 'c7',
        name: 'Transportation',
        color: '#399A57',
        icon: 'Car',
        expectedAmount: 800,
        spentAmount: 330,
        percentage: 8,
        subCategories: ['Loan', 'Gas'],
      },
      {
        id: 'c8',
        name: 'Bills',
        color: '#EF4444',
        icon: 'Home',
        expectedAmount: 4000,
        spentAmount: 4000,
        percentage: 40,
        subCategories: ['Mortgage'],
      },
      {
        id: 'c9',
        name: 'Savings',
        color: '#3B82F6',
        icon: 'PiggyBank',
        expectedAmount: 2000,
        spentAmount: 1500,
        percentage: 20,
        subCategories: ['Transfers'],
      },
      {
        id: 'c10',
        name: 'Personal Expenses',
        color: '#EC4899',
        icon: 'ShoppingBag',
        expectedAmount: 2000,
        spentAmount: 2753,
        percentage: 20,
        subCategories: ['Shopping', 'Gifts'],
      },
    ],
  },
];

export const fatimaTransactions: Transaction[] = [
  // March 2026 - Food
  { id: 't1', date: '2026-03-02', merchant: 'Tim Hortons', amount: 7, category: 'Food' },
  { id: 't2', date: '2026-03-04', merchant: 'Boustan', amount: 12, category: 'Food' },
  { id: 't3', date: '2026-03-06', merchant: 'Second Cup', amount: 9, category: 'Food' },
  { id: 't4', date: '2026-03-09', merchant: 'Shawarma Palace', amount: 18, category: 'Food' },
  { id: 't5', date: '2026-03-12', merchant: 'Uber Eats', amount: 23, category: 'Food' },
  { id: 't6', date: '2026-03-14', merchant: 'Metro Grocery', amount: 54, category: 'Food' },
  { id: 't7', date: '2026-03-16', merchant: 'Farm Boy', amount: 36, category: 'Food' },
  { id: 't8', date: '2026-03-20', merchant: 'Loblaws', amount: 27, category: 'Food' },
  
  // March 2026 - Transport
  { id: 't9', date: '2026-03-01', merchant: 'OC Transpo Fare', amount: 3.75, category: 'Transport' },
  { id: 't10', date: '2026-03-05', merchant: 'Uber Ride', amount: 16, category: 'Transport' },
  { id: 't11', date: '2026-03-08', merchant: 'Lyft Ride', amount: 11, category: 'Transport' },
  { id: 't12', date: '2026-03-11', merchant: 'OC Transpo Ticket', amount: 3.75, category: 'Transport' },
  { id: 't13', date: '2026-03-17', merchant: 'Esso Gas', amount: 8.50, category: 'Transport' },
  
  // March 2026 - Personal Expenses
  { id: 't14', date: '2026-03-03', merchant: 'Sephora', amount: 78, category: 'Personal Expenses' },
  { id: 't15', date: '2026-03-07', merchant: 'Zara', amount: 95, category: 'Personal Expenses' },
  { id: 't16', date: '2026-03-10', merchant: 'Amazon', amount: 63, category: 'Personal Expenses' },
  { id: 't17', date: '2026-03-13', merchant: 'Indigo', amount: 34, category: 'Personal Expenses' },
  { id: 't18', date: '2026-03-15', merchant: 'Apple Store', amount: 149, category: 'Personal Expenses' },
  { id: 't19', date: '2026-03-18', merchant: 'H&M', amount: 48, category: 'Personal Expenses' },
  { id: 't20', date: '2026-03-19', merchant: 'Dollarama', amount: 18, category: 'Personal Expenses' },
  { id: 't21', date: '2026-03-21', merchant: 'Winners', amount: 25, category: 'Personal Expenses' },
  
  // March 2026 - Education
  { id: 't22', date: '2026-03-04', merchant: 'Campus Bookstore', amount: 42, category: 'Education' },
  { id: 't23', date: '2026-03-06', merchant: 'Printing Services', amount: 11, category: 'Education' },
  { id: 't24', date: '2026-03-09', merchant: 'Udemy Course', amount: 19, category: 'Education' },
  { id: 't25', date: '2026-03-12', merchant: 'Stationery Store', amount: 13, category: 'Education' },
  
  // February 2026 - Food
  { id: 't26', date: '2026-02-02', merchant: 'Tim Hortons', amount: 6, category: 'Food' },
  { id: 't27', date: '2026-02-05', merchant: 'Boustan', amount: 11, category: 'Food' },
  { id: 't28', date: '2026-02-07', merchant: 'Second Cup', amount: 10, category: 'Food' },
  { id: 't29', date: '2026-02-09', merchant: 'Subway', amount: 13, category: 'Food' },
  { id: 't30', date: '2026-02-13', merchant: 'Uber Eats', amount: 25, category: 'Food' },
  { id: 't31', date: '2026-02-16', merchant: 'Loblaws', amount: 46, category: 'Food' },
  { id: 't32', date: '2026-02-20', merchant: 'Metro Grocery', amount: 52, category: 'Food' },
  { id: 't33', date: '2026-02-23', merchant: 'Shawarma Palace', amount: 19, category: 'Food' },
  
  // February 2026 - Transport
  { id: 't34', date: '2026-02-03', merchant: 'OC Transpo', amount: 3.75, category: 'Transport' },
  { id: 't35', date: '2026-02-06', merchant: 'Uber Ride', amount: 14, category: 'Transport' },
  { id: 't36', date: '2026-02-11', merchant: 'Lyft Ride', amount: 9, category: 'Transport' },
  { id: 't37', date: '2026-02-17', merchant: 'OC Transpo', amount: 3.75, category: 'Transport' },
  { id: 't38', date: '2026-02-21', merchant: 'Shell Gas', amount: 12, category: 'Transport' },
  
  // February 2026 - Personal Expenses
  { id: 't39', date: '2026-02-04', merchant: 'Amazon', amount: 45, category: 'Personal Expenses' },
  { id: 't40', date: '2026-02-08', merchant: 'Sephora', amount: 92, category: 'Personal Expenses' },
  { id: 't41', date: '2026-02-12', merchant: 'Zara', amount: 84, category: 'Personal Expenses' },
  { id: 't42', date: '2026-02-15', merchant: 'Apple Store', amount: 132, category: 'Personal Expenses' },
  { id: 't43', date: '2026-02-18', merchant: 'Indigo', amount: 41, category: 'Personal Expenses' },
  { id: 't44', date: '2026-02-22', merchant: 'H&M', amount: 53, category: 'Personal Expenses' },
  { id: 't45', date: '2026-02-24', merchant: 'Winners', amount: 29, category: 'Personal Expenses' },
  { id: 't46', date: '2026-02-26', merchant: 'Dollarama', amount: 17, category: 'Personal Expenses' },
  
  // February 2026 - Education
  { id: 't47', date: '2026-02-05', merchant: 'Campus Bookstore', amount: 35, category: 'Education' },
  { id: 't48', date: '2026-02-10', merchant: 'Printing Services', amount: 9, category: 'Education' },
  { id: 't49', date: '2026-02-14', merchant: 'Udemy Course', amount: 25, category: 'Education' },
  { id: 't50', date: '2026-02-19', merchant: 'Stationery Store', amount: 14, category: 'Education' },
  
  // January 2026 - Food
  { id: 't51', date: '2026-01-03', merchant: 'Tim Hortons', amount: 8, category: 'Food' },
  { id: 't52', date: '2026-01-06', merchant: 'Starbucks', amount: 9, category: 'Food' },
  { id: 't53', date: '2026-01-08', merchant: 'Subway', amount: 12, category: 'Food' },
  { id: 't54', date: '2026-01-11', merchant: 'Uber Eats', amount: 22, category: 'Food' },
  { id: 't55', date: '2026-01-15', merchant: 'Loblaws', amount: 49, category: 'Food' },
  { id: 't56', date: '2026-01-18', merchant: 'Metro Grocery', amount: 58, category: 'Food' },
  { id: 't57', date: '2026-01-22', merchant: 'Shawarma Palace', amount: 17, category: 'Food' },
  
  // January 2026 - Transport
  { id: 't58', date: '2026-01-02', merchant: 'OC Transpo', amount: 3.75, category: 'Transport' },
  { id: 't59', date: '2026-01-07', merchant: 'Uber Ride', amount: 13, category: 'Transport' },
  { id: 't60', date: '2026-01-13', merchant: 'Lyft Ride', amount: 10, category: 'Transport' },
  { id: 't61', date: '2026-01-17', merchant: 'OC Transpo', amount: 3.75, category: 'Transport' },
  { id: 't62', date: '2026-01-24', merchant: 'Petro Canada Gas', amount: 11, category: 'Transport' },
  
  // January 2026 - Personal Expenses
  { id: 't63', date: '2026-01-04', merchant: 'Amazon', amount: 71, category: 'Personal Expenses' },
  { id: 't64', date: '2026-01-09', merchant: 'Sephora', amount: 85, category: 'Personal Expenses' },
  { id: 't65', date: '2026-01-12', merchant: 'Zara', amount: 92, category: 'Personal Expenses' },
  { id: 't66', date: '2026-01-16', merchant: 'Apple Store', amount: 138, category: 'Personal Expenses' },
  { id: 't67', date: '2026-01-19', merchant: 'Indigo', amount: 37, category: 'Personal Expenses' },
  { id: 't68', date: '2026-01-21', merchant: 'H&M', amount: 46, category: 'Personal Expenses' },
  { id: 't69', date: '2026-01-25', merchant: 'Winners', amount: 32, category: 'Personal Expenses' },
  { id: 't70', date: '2026-01-27', merchant: 'Dollarama', amount: 19, category: 'Personal Expenses' },
  
  // January 2026 - Education
  { id: 't71', date: '2026-01-05', merchant: 'Campus Bookstore', amount: 44, category: 'Education' },
  { id: 't72', date: '2026-01-10', merchant: 'Printing Services', amount: 10, category: 'Education' },
  { id: 't73', date: '2026-01-15', merchant: 'Udemy Course', amount: 21, category: 'Education' },
  { id: 't74', date: '2026-01-20', merchant: 'Stationery Store', amount: 13, category: 'Education' },
  
  // Savings (March)
  { id: 't75', date: '2026-03-05', merchant: 'Savings Transfer', amount: 278, category: 'Savings' },
];

export const edwardTransactions: Transaction[] = [
  // March 2026 - Food
  { id: 'e1', date: '2026-03-02', merchant: 'Tim Hortons', amount: 12, category: 'Food' },
  { id: 'e2', date: '2026-03-03', merchant: 'Second Cup', amount: 9, category: 'Food' },
  { id: 'e3', date: '2026-03-04', merchant: 'Metro Grocery', amount: 145, category: 'Food' },
  { id: 'e4', date: '2026-03-05', merchant: 'Boustan', amount: 14, category: 'Food' },
  { id: 'e5', date: '2026-03-07', merchant: 'Farm Boy', amount: 82, category: 'Food' },
  { id: 'e6', date: '2026-03-09', merchant: 'Uber Eats', amount: 36, category: 'Food' },
  { id: 'e7', date: '2026-03-10', merchant: 'Loblaws', amount: 124, category: 'Food' },
  { id: 'e8', date: '2026-03-12', merchant: 'Shawarma Palace', amount: 21, category: 'Food' },
  { id: 'e9', date: '2026-03-14', merchant: 'Costco Grocery', amount: 203, category: 'Food' },
  { id: 'e10', date: '2026-03-17', merchant: 'Subway', amount: 13, category: 'Food' },
  { id: 'e11', date: '2026-03-19', merchant: 'Whole Foods', amount: 111, category: 'Food' },
  { id: 'e12', date: '2026-03-22', merchant: 'Pizza Pizza', amount: 18, category: 'Food' },
  { id: 'e13', date: '2026-03-24', merchant: 'Farm Boy', amount: 62, category: 'Food' },
  { id: 'e14', date: '2026-03-27', merchant: 'Second Cup', amount: 11, category: 'Food' },
  { id: 'e15', date: '2026-03-29', merchant: 'Uber Eats', amount: 35, category: 'Food' },
  
  // March 2026 - Transportation
  { id: 'e16', date: '2026-03-01', merchant: 'RBC Auto Loan Payment', amount: 250, category: 'Transportation', recurring: true },
  { id: 'e17', date: '2026-03-06', merchant: 'Petro-Canada Gas', amount: 38, category: 'Transportation' },
  { id: 'e18', date: '2026-03-13', merchant: 'Esso Gas', amount: 26, category: 'Transportation' },
  { id: 'e19', date: '2026-03-20', merchant: 'Shell Gas', amount: 16, category: 'Transportation' },
  
  // March 2026 - Bills
  { id: 'e20', date: '2026-03-01', merchant: 'TD Mortgage Payment', amount: 4000, category: 'Bills', recurring: true },
  
  // March 2026 - Savings
  { id: 'e21', date: '2026-03-05', merchant: 'Transfer to Savings Account', amount: 500, category: 'Savings' },
  { id: 'e22', date: '2026-03-15', merchant: 'Transfer to Savings Account', amount: 500, category: 'Savings' },
  { id: 'e23', date: '2026-03-28', merchant: 'Transfer to Savings Account', amount: 500, category: 'Savings' },
  
  // March 2026 - Personal Expenses
  { id: 'e24', date: '2026-03-02', merchant: 'Amazon', amount: 156, category: 'Personal Expenses' },
  { id: 'e25', date: '2026-03-04', merchant: 'Apple Store', amount: 899, category: 'Personal Expenses' },
  { id: 'e26', date: '2026-03-07', merchant: 'Sephora', amount: 114, category: 'Personal Expenses' },
  { id: 'e27', date: '2026-03-09', merchant: 'Zara', amount: 134, category: 'Personal Expenses' },
  { id: 'e28', date: '2026-03-11', merchant: 'Indigo Books', amount: 47, category: 'Personal Expenses' },
  { id: 'e29', date: '2026-03-13', merchant: 'Best Buy', amount: 322, category: 'Personal Expenses' },
  { id: 'e30', date: '2026-03-16', merchant: 'Winners', amount: 68, category: 'Personal Expenses' },
  { id: 'e31', date: '2026-03-18', merchant: 'Nike Store', amount: 210, category: 'Personal Expenses' },
  { id: 'e32', date: '2026-03-21', merchant: 'Etsy Gift Purchase', amount: 76, category: 'Personal Expenses' },
  { id: 'e33', date: '2026-03-23', merchant: 'H&M', amount: 88, category: 'Personal Expenses' },
  { id: 'e34', date: '2026-03-25', merchant: 'Ikea', amount: 390, category: 'Personal Expenses' },
  { id: 'e35', date: '2026-03-27', merchant: 'Dollarama', amount: 19, category: 'Personal Expenses' },
  { id: 'e36', date: '2026-03-30', merchant: 'Amazon', amount: 230, category: 'Personal Expenses' },
  
  // February 2026 - Food
  { id: 'e37', date: '2026-02-02', merchant: 'Boulangerie Première Moisson', amount: 18, category: 'Food' },
  { id: 'e38', date: '2026-02-04', merchant: 'IGA Grocery', amount: 126, category: 'Food' },
  { id: 'e39', date: '2026-02-05', merchant: 'Tim Hortons', amount: 8, category: 'Food' },
  { id: 'e40', date: '2026-02-07', merchant: 'Uber Eats', amount: 29, category: 'Food' },
  { id: 'e41', date: '2026-02-09', merchant: 'Adonis Market', amount: 164, category: 'Food' },
  { id: 'e42', date: '2026-02-11', merchant: 'Subway', amount: 12, category: 'Food' },
  { id: 'e43', date: '2026-02-13', merchant: 'Costco Grocery', amount: 219, category: 'Food' },
  { id: 'e44', date: '2026-02-16', merchant: 'Pizza Pizza', amount: 21, category: 'Food' },
  { id: 'e45', date: '2026-02-18', merchant: 'Provigo', amount: 103, category: 'Food' },
  { id: 'e46', date: '2026-02-21', merchant: 'Farm Boy', amount: 72, category: 'Food' },
  { id: 'e47', date: '2026-02-24', merchant: 'Thai Express', amount: 34, category: 'Food' },
  { id: 'e48', date: '2026-02-27', merchant: 'Loblaws', amount: 90, category: 'Food' },
  
  // February 2026 - Transportation
  { id: 'e49', date: '2026-02-01', merchant: 'RBC Auto Loan Payment', amount: 248, category: 'Transportation', recurring: true },
  { id: 'e50', date: '2026-02-08', merchant: 'Shell Gas', amount: 33, category: 'Transportation' },
  { id: 'e51', date: '2026-02-15', merchant: 'Petro-Canada Gas', amount: 28, category: 'Transportation' },
  { id: 'e52', date: '2026-02-22', merchant: 'Esso Gas', amount: 21, category: 'Transportation' },
  
  // February 2026 - Bills
  { id: 'e53', date: '2026-02-01', merchant: 'TD Mortgage Payment', amount: 4000, category: 'Bills', recurring: true },
  
  // February 2026 - Savings
  { id: 'e54', date: '2026-02-06', merchant: 'Transfer to Savings', amount: 600, category: 'Savings' },
  { id: 'e55', date: '2026-02-14', merchant: 'Transfer to Savings', amount: 450, category: 'Savings' },
  { id: 'e56', date: '2026-02-26', merchant: 'Transfer to Savings', amount: 450, category: 'Savings' },
  
  // February 2026 - Personal Expenses
  { id: 'e57', date: '2026-02-03', merchant: 'Amazon', amount: 214, category: 'Personal Expenses' },
  { id: 'e58', date: '2026-02-06', merchant: 'Apple Store', amount: 905, category: 'Personal Expenses' },
  { id: 'e59', date: '2026-02-08', merchant: 'Sephora', amount: 92, category: 'Personal Expenses' },
  { id: 'e60', date: '2026-02-10', merchant: 'Zara', amount: 158, category: 'Personal Expenses' },
  { id: 'e61', date: '2026-02-12', merchant: 'Indigo Books', amount: 43, category: 'Personal Expenses' },
  { id: 'e62', date: '2026-02-14', merchant: 'Best Buy', amount: 317, category: 'Personal Expenses' },
  { id: 'e63', date: '2026-02-17', merchant: 'Nike Store', amount: 192, category: 'Personal Expenses' },
  { id: 'e64', date: '2026-02-19', merchant: 'Winners', amount: 81, category: 'Personal Expenses' },
  { id: 'e65', date: '2026-02-21', merchant: 'Etsy Gift Purchase', amount: 69, category: 'Personal Expenses' },
  { id: 'e66', date: '2026-02-23', merchant: 'Ikea', amount: 396, category: 'Personal Expenses' },
  { id: 'e67', date: '2026-02-25', merchant: 'Simons', amount: 181, category: 'Personal Expenses' },
  { id: 'e68', date: '2026-02-27', merchant: 'Dollarama', amount: 27, category: 'Personal Expenses' },
  { id: 'e69', date: '2026-02-28', merchant: 'Amazon', amount: 78, category: 'Personal Expenses' },
  
  // January 2026 - Food
  { id: 'e70', date: '2026-01-01', merchant: 'Tim Hortons', amount: 11, category: 'Food' },
  { id: 'e71', date: '2026-01-03', merchant: 'Provigo Grocery', amount: 132, category: 'Food' },
  { id: 'e72', date: '2026-01-05', merchant: 'Subway', amount: 14, category: 'Food' },
  { id: 'e73', date: '2026-01-06', merchant: 'Uber Eats', amount: 33, category: 'Food' },
  { id: 'e74', date: '2026-01-08', merchant: 'Adonis Market', amount: 149, category: 'Food' },
  { id: 'e75', date: '2026-01-10', merchant: 'Pizza Pizza', amount: 23, category: 'Food' },
  { id: 'e76', date: '2026-01-12', merchant: 'Costco Grocery', amount: 218, category: 'Food' },
  { id: 'e77', date: '2026-01-15', merchant: 'Thai Express', amount: 26, category: 'Food' },
  { id: 'e78', date: '2026-01-18', merchant: 'IGA Grocery', amount: 97, category: 'Food' },
  { id: 'e79', date: '2026-01-20', merchant: 'Farm Boy', amount: 68, category: 'Food' },
  { id: 'e80', date: '2026-01-24', merchant: 'Shawarma Palace', amount: 36, category: 'Food' },
  { id: 'e81', date: '2026-01-27', merchant: 'Loblaws', amount: 89, category: 'Food' },
  
  // January 2026 - Transportation
  { id: 'e82', date: '2026-01-01', merchant: 'RBC Auto Loan Payment', amount: 252, category: 'Transportation', recurring: true },
  { id: 'e83', date: '2026-01-07', merchant: 'Petro-Canada Gas', amount: 31, category: 'Transportation' },
  { id: 'e84', date: '2026-01-16', merchant: 'Shell Gas', amount: 27, category: 'Transportation' },
  { id: 'e85', date: '2026-01-25', merchant: 'Esso Gas', amount: 20, category: 'Transportation' },
  
  // January 2026 - Bills
  { id: 'e86', date: '2026-01-01', merchant: 'TD Mortgage Payment', amount: 4000, category: 'Bills', recurring: true },
  
  // January 2026 - Savings
  { id: 'e87', date: '2026-01-04', merchant: 'Transfer to Savings', amount: 500, category: 'Savings' },
  { id: 'e88', date: '2026-01-13', merchant: 'Transfer to Savings', amount: 500, category: 'Savings' },
  { id: 'e89', date: '2026-01-28', merchant: 'Transfer to Savings', amount: 500, category: 'Savings' },
  
  // January 2026 - Personal Expenses
  { id: 'e90', date: '2026-01-02', merchant: 'Amazon', amount: 188, category: 'Personal Expenses' },
  { id: 'e91', date: '2026-01-04', merchant: 'Apple Store', amount: 912, category: 'Personal Expenses' },
  { id: 'e92', date: '2026-01-07', merchant: 'Sephora', amount: 103, category: 'Personal Expenses' },
  { id: 'e93', date: '2026-01-09', merchant: 'Zara', amount: 146, category: 'Personal Expenses' },
  { id: 'e94', date: '2026-01-11', merchant: 'Indigo Books', amount: 39, category: 'Personal Expenses' },
  { id: 'e95', date: '2026-01-13', merchant: 'Best Buy', amount: 334, category: 'Personal Expenses' },
  { id: 'e96', date: '2026-01-15', merchant: 'Nike Store', amount: 204, category: 'Personal Expenses' },
  { id: 'e97', date: '2026-01-18', merchant: 'Winners', amount: 73, category: 'Personal Expenses' },
  { id: 'e98', date: '2026-01-20', merchant: 'Etsy Gift Purchase', amount: 64, category: 'Personal Expenses' },
  { id: 'e99', date: '2026-01-22', merchant: 'Ikea', amount: 371, category: 'Personal Expenses' },
  { id: 'e100', date: '2026-01-24', merchant: 'Simons', amount: 199, category: 'Personal Expenses' },
  { id: 'e101', date: '2026-01-27', merchant: 'Dollarama', amount: 28, category: 'Personal Expenses' },
  { id: 'e102', date: '2026-01-30', merchant: 'Amazon', amount: 92, category: 'Personal Expenses' },
];

export const debts: Debt[] = [
  {
    id: 'd1',
    userId: '1',
    name: 'Student Loan',
    totalAmount: 10000,
    remainingAmount: 4373,
    paidAmount: 5627,
    interestRate: 2,
    minimumPayment: 100,
    period: 'monthly',
    paymentFrequency: 'monthly',
  },
  {
    id: 'd2',
    userId: '2',
    name: 'Mortgage',
    totalAmount: 420000,
    remainingAmount: 318000,
    paidAmount: 102000,
    interestRate: 4.8,
    minimumPayment: 4000,
    period: 'monthly',
    paymentFrequency: 'monthly',
  },
  {
    id: 'd3',
    userId: '2',
    name: 'Car Payment',
    totalAmount: 24000,
    remainingAmount: 9200,
    paidAmount: 14800,
    interestRate: 6.2,
    minimumPayment: 250,
    period: 'monthly',
    paymentFrequency: 'monthly',
  },
];
