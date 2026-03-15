import React, { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronLeft, ChevronRight, Lightbulb, TrendingUp } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { transactions, currentBudget, currentMonth, setCurrentMonth, minMonth, maxMonth, theme, formatCurrency } = useApp();

  const canGoPrevious = currentMonth > minMonth;
  const canGoNext = currentMonth < maxMonth;

  const currentMonthTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
      }),
    [transactions, currentMonth],
  );

  const expectedVsActual = useMemo(() => {
    return (currentBudget?.categories || []).map((category) => {
      const actual = currentMonthTransactions.filter((transaction) => transaction.category === category.name).reduce((sum, transaction) => sum + transaction.amount, 0);
      return {
        name: category.name.length > 10 ? `${category.name.slice(0, 10)}…` : category.name,
        expected: category.expectedAmount,
        actual,
      };
    });
  }, [currentBudget, currentMonthTransactions]);

  const monthlyTrend = useMemo(() => {
    return [0, 1, 2].map((monthIndex) => {
      const monthTransactions = transactions.filter((transaction) => {
        const date = new Date(transaction.date);
        return date.getMonth() === monthIndex && date.getFullYear() === 2026;
      });
      return {
        month: new Date(2026, monthIndex, 1).toLocaleDateString('en', { month: 'short' }),
        spent: monthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
      };
    });
  }, [transactions]);

  const monthTotal = currentMonthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const averageTransaction = currentMonthTransactions.length ? monthTotal / currentMonthTransactions.length : 0;
  const topCategory = expectedVsActual.slice().sort((a, b) => b.actual - a.actual)[0];
  const peakWeekday = useMemo(() => {
    const weekdays: Record<string, number> = {};
    currentMonthTransactions.forEach((transaction) => {
      const weekday = new Date(transaction.date).toLocaleDateString('en', { weekday: 'long' });
      weekdays[weekday] = (weekdays[weekday] || 0) + transaction.amount;
    });
    return Object.entries(weekdays).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [currentMonthTransactions]);

  const monthLabel = currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' });
  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#dce8e1]';

  return (
    <MobileLayout showNavigation>
      <div className="px-4 pb-8 pt-4">
        <div className={`rounded-[26px] border p-4 shadow-sm ${cardBg}`}>
          <div className="flex items-center justify-between">
            <button disabled={!canGoPrevious} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className={`${canGoPrevious ? 'text-emerald-600' : 'invisible'} rounded-full p-2`}>
              <ChevronLeft size={26} />
            </button>
            <div className="text-center">
              <p className="text-2xl font-extrabold">Analytics</p>
              <p className="text-sm font-semibold text-emerald-500">{monthLabel}</p>
            </div>
            <button disabled={!canGoNext} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className={`${canGoNext ? 'text-emerald-600' : 'invisible'} rounded-full p-2`}>
              <ChevronRight size={26} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard title="This month" value={formatCurrency(monthTotal)} accent="text-emerald-500" cardBg={cardBg} />
          <StatCard title="Avg transaction" value={formatCurrency(averageTransaction)} accent="text-sky-500" cardBg={cardBg} />
        </div>

        <div className={`mt-4 rounded-[28px] border p-4 shadow-sm ${cardBg}`}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-extrabold">Expected vs actual</p>
              <p className="text-sm text-slate-500">Cleaner monthly comparison by category.</p>
            </div>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={expectedVsActual} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="expected" radius={[8, 8, 0, 0]} fill="#a5b4fc" />
              <Bar dataKey="actual" radius={[8, 8, 0, 0]} fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`mt-4 rounded-[28px] border p-4 shadow-sm ${cardBg}`}>
          <div className="mb-3">
            <p className="text-lg font-extrabold">Spending momentum</p>
            <p className="text-sm text-slate-500">Track how your total spending is moving across the quarter.</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="spendFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area type="monotone" dataKey="spent" stroke="#10b981" strokeWidth={3} fill="url(#spendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`mt-4 rounded-[28px] border p-4 shadow-sm ${cardBg}`}>
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <p className="text-lg font-extrabold">Consumer trends</p>
          </div>
          <div className="space-y-3 text-sm">
            <Insight text={`Your top spending category this month is ${topCategory?.name || 'N/A'}, which reached ${formatCurrency(topCategory?.actual || 0)}.`} />
            <Insight text={`Your highest spending day pattern lands on ${peakWeekday}.`} />
            <Insight text={`You made ${currentMonthTransactions.length} purchases in ${monthLabel}, averaging ${formatCurrency(averageTransaction)} per transaction.`} />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

const StatCard = ({ title, value, accent, cardBg }: { title: string; value: string; accent: string; cardBg: string }) => (
  <div className={`rounded-[24px] border p-4 shadow-sm ${cardBg}`}>
    <p className="text-sm text-slate-500">{title}</p>
    <p className={`mt-1 text-2xl font-extrabold ${accent}`}>{value}</p>
  </div>
);

const Insight = ({ text }: { text: string }) => <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">{text}</div>;
