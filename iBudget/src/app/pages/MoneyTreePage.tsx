import React, { useMemo } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import logo from '../../assets/ibudget-logo-transparent.png';

const LEVELS = [
  { level: 1, target: 50, label: '$50 - Seedling' },
  { level: 2, target: 100, label: '$100 - Sprout' },
  { level: 3, target: 200, label: '$200 - Young Tree' },
  { level: 4, target: 400, label: '$400 - Growing Tree' },
  { level: 5, target: 750, label: '$750 - Strong Tree' },
  { level: 6, target: 1000, label: '$1,000 - Money Tree' },
  { level: 7, target: 2000, label: '$2,000 - Forest' },
  { level: 8, target: 5000, label: '$5,000 - Grove' },
];

export const MoneyTreePage: React.FC = () => {
  const { currentBudget, formatCurrency } = useApp();

  const totalSavings = useMemo(() => {
    if (!currentBudget) return 0;
    return Math.max(0, currentBudget.monthlyBudget - currentBudget.categories.reduce((sum, category) => sum + category.spentAmount, 0));
  }, [currentBudget]);

  const currentLevel = useMemo(() => LEVELS.filter((level) => totalSavings >= level.target).length, [totalSavings]);
  const nextLevel = LEVELS[currentLevel] || null;
  const progressToNextLevel = nextLevel ? Math.min((totalSavings / nextLevel.target) * 100, 100) : 100;

  return (
    <MobileLayout showNavigation>
      <div className="min-h-full bg-gradient-to-b from-[#eaf6ef] to-white px-4 pb-8 pt-4 dark:from-slate-950 dark:to-slate-900">
        <div className="rounded-[30px] border border-[#dce8e1] bg-white p-6 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <img src={logo} alt="Money Tree" className="mx-auto h-28 w-28 object-contain" style={{ transform: `scale(${0.7 + currentLevel * 0.06})` }} />
          <p className="mt-4 text-sm font-semibold text-slate-500">Current savings</p>
          <p className="text-3xl font-extrabold text-emerald-500">{formatCurrency(totalSavings)}</p>
          <div className="mt-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-4 rounded-full bg-emerald-500" style={{ width: `${progressToNextLevel}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-500">{nextLevel ? `${formatCurrency(nextLevel.target - totalSavings)} to reach ${nextLevel.label}` : 'You reached the top milestone.'}</p>
        </div>
        <div className="mt-4 space-y-3">
          {LEVELS.map((level) => (
            <div key={level.level} className={`rounded-[24px] border p-4 shadow-sm ${currentLevel >= level.level ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10' : 'border-[#dce8e1] bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
              <div className="flex items-center justify-between">
                <p className="font-bold">{level.label}</p>
                <span className="text-sm font-semibold text-emerald-500">Level {level.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};
