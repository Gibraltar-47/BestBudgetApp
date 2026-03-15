import React, { useMemo, useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';

export const DebtTrackerPage: React.FC = () => {
  const { debts, addDebt, formatCurrency, theme } = useApp();
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [formData, setFormData] = useState({ name: '', totalAmount: '0', remainingAmount: '0', interestRate: '0', minimumPayment: '0', period: 'Monthly' });

  const totals = useMemo(() => {
    const total = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
    const remaining = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
    return { total, remaining, paid: total - remaining };
  }, [debts]);

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#dce8e1]';

  return (
    <MobileLayout showNavigation>
      <div className="relative px-4 pb-8 pt-4">
        <div className={`rounded-[28px] border p-5 shadow-sm ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold">Debt Tracker</p>
              <p className="text-sm text-slate-500">Clean repayment view for every profile.</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
              <Wallet size={24} className="text-emerald-500" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <Summary title="Total" value={formatCurrency(totals.total)} />
            <Summary title="Remaining" value={formatCurrency(totals.remaining)} />
            <Summary title="Paid" value={formatCurrency(totals.paid)} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {debts.map((debt) => {
            const progress = debt.totalAmount > 0 ? ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100 : 0;
            return (
              <div key={debt.id} className={`rounded-[24px] border p-4 shadow-sm ${cardBg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold">{debt.name}</p>
                    <p className="text-sm text-slate-500">{debt.period} • {debt.interestRate}% interest</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-500">Min payment</p>
                    <p className="font-bold text-emerald-500">{formatCurrency(debt.minimumPayment)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-sm font-bold text-emerald-500">{progress.toFixed(0)}%</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Remaining</span>
                  <span className="font-bold">{formatCurrency(debt.remainingAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setShowAddDebt(true)} className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
          <Plus size={22} />
        </button>

        {showAddDebt && (
          <>
            <div className="absolute inset-0 z-30 bg-black/40" onClick={() => setShowAddDebt(false)} />
            <div className="absolute left-1/2 top-1/2 z-40 w-[88%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-5 shadow-2xl dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Add debt</h3>
                <button onClick={() => setShowAddDebt(false)} className="text-sm font-semibold text-slate-500">Close</button>
              </div>
              <div className="space-y-3">
                <Input label="Debt name" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} />
                <Input label="Total owed" type="number" value={formData.totalAmount} onChange={(value) => setFormData({ ...formData, totalAmount: value })} />
                <Input label="Remaining balance" type="number" value={formData.remainingAmount} onChange={(value) => setFormData({ ...formData, remainingAmount: value })} />
                <Input label="Interest rate" type="number" value={formData.interestRate} onChange={(value) => setFormData({ ...formData, interestRate: value })} />
                <Input label="Minimum payment" type="number" value={formData.minimumPayment} onChange={(value) => setFormData({ ...formData, minimumPayment: value })} />
                <button
                  onClick={() => {
                    addDebt({
                      name: formData.name,
                      totalAmount: Number(formData.totalAmount),
                      remainingAmount: Number(formData.remainingAmount),
                      interestRate: Number(formData.interestRate),
                      minimumPayment: Number(formData.minimumPayment),
                      period: formData.period,
                    });
                    setShowAddDebt(false);
                  }}
                  className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white"
                >
                  Save debt
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
};

const Summary = ({ title, value }: { title: string; value: string }) => <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800"><p className="text-xs text-slate-500">{title}</p><p className="mt-1 text-base font-extrabold">{value}</p></div>;
const Input = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) => <div><label className="mb-1 block text-sm font-semibold">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800" /></div>;
