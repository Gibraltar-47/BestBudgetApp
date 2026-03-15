import React, { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { Plus, ChevronDown, ChevronUp, Calculator, X, Trash2 } from 'lucide-react';
import { Debt } from '../types';
import { t } from '../i18n';
import { formatMoney } from '../utils';

export const DebtTrackerPage: React.FC = () => {
  const { debts, currency, language, theme, addDebt, deleteDebt } = useApp();
  const [expandedDebt, setExpandedDebt] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState<Debt | null>(null);
  const [simulatorPayment, setSimulatorPayment] = useState('0');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', totalAmount: '', remainingAmount: '', interestRate: '', minimumPayment: '', paymentFrequency: 'monthly' as 'weekly' | 'biweekly' | 'monthly' });

  const panel = theme === 'dark' ? 'bg-[#1d2523] text-white' : 'bg-white text-[#163321]';

  const calculateRemainingTime = (debt: Debt, extraPayment = 0) => {
    const payment = debt.minimumPayment + extraPayment;
    const monthlyRate = debt.interestRate / 100 / 12;
    if (!monthlyRate || payment <= debt.remainingAmount * monthlyRate) return Math.ceil(debt.remainingAmount / Math.max(payment, 1));
    return Math.ceil(Math.log(payment / (payment - debt.remainingAmount * monthlyRate)) / Math.log(1 + monthlyRate));
  };

  return (
    <MobileLayout showNavigation>
      <div className="px-4 py-5">
        <h1 className="mb-4 text-[24px] font-bold">{t(language, 'debtTracker')}</h1>
        <div className="space-y-3">
          {debts.map((debt) => {
            const expanded = expandedDebt === debt.id;
            const progress = Math.round((debt.paidAmount / debt.totalAmount) * 100);
            return (
              <div key={debt.id} className={`rounded-[28px] ${panel} p-4 shadow-sm`}>
                <button className="flex w-full items-center justify-between" onClick={() => setExpandedDebt(expanded ? null : debt.id)}>
                  <div>
                    <div className="text-[18px] font-bold">{debt.name}</div>
                    <div className="text-[13px] text-[#6a7b70]">{formatMoney(debt.remainingAmount, currency)} {t(language, 'remaining')}</div>
                  </div>
                  {expanded ? <ChevronUp /> : <ChevronDown />}
                </button>
                <div className="mt-3 h-3 rounded-full bg-black/10 overflow-hidden"><div className="h-full rounded-full bg-[#3d9b5d]" style={{ width: `${progress}%` }} /></div>
                {expanded && (
                  <div className="mt-4 space-y-2 text-[14px]">
                    <div>{t(language, 'total')}: {formatMoney(debt.totalAmount, currency)}</div>
                    <div>{t(language, 'interestRate')}: {debt.interestRate}%</div>
                    <div>{t(language, 'minimumPayment')}: {formatMoney(debt.minimumPayment, currency)}</div>
                    <div>{t(language, 'paymentFrequency')}: {debt.paymentFrequency ?? 'monthly'}</div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button onClick={() => setShowSimulator(debt)} className="rounded-xl bg-[#edf5ef] px-4 py-3 font-semibold text-[#163321]">{t(language, 'viewSimulator')}</button>
                      <button onClick={() => deleteDebt(debt.id)} className="rounded-xl border border-red-200 px-4 py-3 text-red-600 flex items-center justify-center gap-2"><Trash2 size={16} /> {t(language, 'delete')}</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={() => setShowAdd(true)} className="absolute bottom-[94px] right-4 z-20 rounded-full bg-[#3d9b5d] p-4 text-white shadow-lg"><Plus size={22} /></button>
      </div>

      {showSimulator && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[340px] rounded-[28px] bg-white p-5 text-[#163321] shadow-xl">
            <div className="mb-4 flex items-center justify-between"><div className="text-[20px] font-bold">{showSimulator.name} Simulator</div><button onClick={() => setShowSimulator(null)}><X /></button></div>
            <div className="mb-3 flex items-center gap-2 rounded-2xl bg-[#f4f7f4] p-3"><Calculator size={18} /> Extra payment</div>
            <input type="number" value={simulatorPayment} onChange={(e) => setSimulatorPayment(e.target.value)} className="w-full rounded-xl border px-4 py-3" />
            <div className="mt-4 space-y-2 text-[14px]">
              <div>Estimated payoff: {calculateRemainingTime(showSimulator, Number(simulatorPayment))} months</div>
              <div>New monthly payment: {formatMoney(showSimulator.minimumPayment + Number(simulatorPayment), currency)}</div>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[340px] rounded-[28px] bg-white p-5 text-[#163321] shadow-xl">
            <div className="mb-4 flex items-center justify-between"><div className="text-[20px] font-bold">{t(language, 'addDebt')}</div><button onClick={() => setShowAdd(false)}><X /></button></div>
            <div className="space-y-3">
              <input className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'debtName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input type="number" className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'total')} value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} />
              <input type="number" className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'remaining')} value={form.remainingAmount} onChange={(e) => setForm({ ...form, remainingAmount: e.target.value })} />
              <input type="number" className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'interestRate')} value={form.interestRate} onChange={(e) => setForm({ ...form, interestRate: e.target.value })} />
              <input type="number" className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'minimumPayment')} value={form.minimumPayment} onChange={(e) => setForm({ ...form, minimumPayment: e.target.value })} />
              <select className="w-full rounded-xl border px-4 py-3" value={form.paymentFrequency} onChange={(e) => setForm({ ...form, paymentFrequency: e.target.value as any })}>
                <option value="monthly">{t(language, 'monthly')}</option>
                <option value="biweekly">{t(language, 'biweekly')}</option>
                <option value="weekly">{t(language, 'weekly')}</option>
              </select>
              <button onClick={() => { addDebt({ name: form.name, totalAmount: Number(form.totalAmount), remainingAmount: Number(form.remainingAmount), paidAmount: Number(form.totalAmount) - Number(form.remainingAmount), interestRate: Number(form.interestRate), minimumPayment: Number(form.minimumPayment), period: form.paymentFrequency, paymentFrequency: form.paymentFrequency }); setShowAdd(false); }} className="w-full rounded-xl bg-[#3d9b5d] px-4 py-3 font-semibold text-white">{t(language, 'trackDebt')}</button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};
