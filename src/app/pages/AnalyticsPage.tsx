import React, { useMemo } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { t } from '../i18n';
import { formatMoney } from '../utils';

const MIN_MONTH = new Date(2026, 0, 1);
const MAX_MONTH = new Date(2026, 2, 1);

export const AnalyticsPage: React.FC = () => {
  const { currentBudget, currentMonth, setCurrentMonth, theme, language, currency } = useApp();
  const panel = theme === 'dark' ? 'bg-[#1d2523] text-white' : 'bg-white text-[#163321]';
  const canGoPrev = currentMonth > MIN_MONTH;
  const canGoNext = currentMonth < MAX_MONTH;

  const expectedActual = useMemo(() => (currentBudget?.categories ?? []).map((cat) => ({
    name: cat.name.length > 10 ? cat.name.slice(0, 10) : cat.name,
    expected: cat.expectedAmount,
    actual: cat.spentAmount,
  })), [currentBudget]);

  const trend = useMemo(() => {
    if (!currentBudget) return [];
    return currentBudget.categories.map((cat, index) => ({
      step: ['Week 1', 'Week 2', 'Week 3', 'Week 4'][index % 4],
      spend: Math.round(cat.spentAmount * (0.35 + index * 0.12)),
    }));
  }, [currentBudget]);

  return (
    <MobileLayout showNavigation>
      <div className="px-4 py-5">
        <div className="mb-4 flex items-center justify-between">
          <button disabled={!canGoPrev} onClick={() => canGoPrev && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className={`rounded-full p-2 ${canGoPrev ? panel : 'opacity-30'}`}><ChevronLeft /></button>
          <div className="text-center">
            <div className="text-[24px] font-bold">{t(language, 'analytics')}</div>
            <div className="text-[12px] text-[#6a7b70]">{currentMonth.toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', { month: 'long', year: 'numeric' })}</div>
          </div>
          <button disabled={!canGoNext} onClick={() => canGoNext && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className={`rounded-full p-2 ${canGoNext ? panel : 'opacity-30'}`}><ChevronRight /></button>
        </div>

        <div className={`rounded-[28px] ${panel} p-4 shadow-sm mb-4`}>
          <div className="mb-3 text-[18px] font-bold">{t(language, 'expectedVsActual')}</div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expectedActual} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Bar dataKey="expected" fill="#9fd1ae" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actual" fill="#3d9b5d" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-[28px] ${panel} p-4 shadow-sm mb-4`}>
          <div className="mb-3 text-[18px] font-bold">{t(language, 'spendingPattern')}</div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3d9b5d" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3d9b5d" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="step" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Area type="monotone" dataKey="spend" stroke="#3d9b5d" fill="url(#colorSpend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-[28px] ${panel} p-4 shadow-sm`}>
          <div className="mb-3 text-[18px] font-bold">{t(language, 'consumerTrends')}</div>
          <div className="space-y-3 text-[14px] text-[#6a7b70]">
            <div className="rounded-2xl bg-black/5 p-3">• {t(language, 'insight1')}</div>
            <div className="rounded-2xl bg-black/5 p-3">• {t(language, 'insight2')}</div>
            <div className="rounded-2xl bg-black/5 p-3">• {t(language, 'insight3')}</div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};
