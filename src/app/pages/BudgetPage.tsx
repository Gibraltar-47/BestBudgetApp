import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, Download, Edit2, Trash2, UserPlus, UserCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { t } from '../i18n';
import { exportJson, exportSimplePdf, exportTransactionsCsv, formatMoney } from '../utils';

const MIN_MONTH = new Date(2026, 0, 1);
const MAX_MONTH = new Date(2026, 2, 1);

const getIconComponent = (iconName: string) => (LucideIcons as any)[iconName] || LucideIcons.CircleDollarSign;
const monthRange = (date: Date, lang: 'en' | 'fr') => {
  const m = date.getMonth();
  if (m === 0) return t(lang, 'monthRangeJanuary');
  if (m === 1) return t(lang, 'monthRangeFebruary');
  return t(lang, 'monthRangeMarch');
};

export const BudgetPage: React.FC = () => {
  const { currentUser, currentBudget, currentMonth, setCurrentMonth, theme, language, currency, updateBudget, transactions, addCollaborator, removeCollaborator } = useApp();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showCollaborator, setShowCollaborator] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({ title: currentBudget?.title ?? '', period: currentBudget?.period ?? 'monthly', startDate: currentBudget?.startDate ?? '2026-03-01', endDate: currentBudget?.endDate ?? '2026-03-30' });

  if (!currentUser) {
    navigate('/');
    return null;
  }

  if (!currentBudget) {
    return (
      <MobileLayout showNavigation>
        <div className="px-5 py-10 text-center">
          <div className="mx-auto mb-6 flex h-[180px] w-[180px] items-center justify-center rounded-full bg-[#ebefec] text-[24px] font-bold text-[#163321]">{t(language, 'noBudget')}</div>
          <div className="mb-3 text-[24px] font-bold">{t(language, 'getStarted')}</div>
          <button onClick={() => navigate('/add-budget')} className="rounded-2xl bg-[#3d9b5d] px-8 py-3 font-semibold text-white">{t(language, 'startYourBudget')}</button>
        </div>
      </MobileLayout>
    );
  }

  const canGoPrev = currentMonth > MIN_MONTH;
  const canGoNext = currentMonth < MAX_MONTH;
  const totalSpent = currentBudget.categories.reduce((sum, cat) => sum + cat.spentAmount, 0);
  const remaining = currentBudget.monthlyBudget - totalSpent;

  const pieData = currentBudget.categories.map((cat) => ({ name: cat.name, value: Math.max(cat.expectedAmount, 1), color: cat.color }));
  const monthlyTransactions = useMemo(() => transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  }), [transactions, currentMonth]);

  const handleExport = (kind: 'pdf' | 'csv' | 'json') => {
    const lines = monthlyTransactions.map((tx) => `${tx.date} • ${tx.merchant} • ${tx.category} • ${tx.amount}`);
    if (kind === 'pdf') exportSimplePdf(`${currentBudget.title} - ${monthRange(currentMonth, language)}`, lines, 'budget-summary.pdf');
    if (kind === 'csv') exportTransactionsCsv(monthlyTransactions);
    if (kind === 'json') exportJson({ budget: currentBudget, transactions: monthlyTransactions }, 'budget-data.json');
    setShowExport(false);
  };

  const handleCollaboratorInvite = () => {
    if (!inviteEmail) return;
    const name = inviteEmail.split('@')[0].split(/[._-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    const result = addCollaborator(currentBudget.id, name);
    if (!result.ok) {
      setError(result.message ?? 'Unable to add collaborator');
      return;
    }
    setInviteEmail('');
    setError('');
    setShowCollaborator(false);
  };

  const panel = theme === 'dark' ? 'bg-[#1d2523] text-white' : 'bg-white text-[#163321]';

  return (
    <MobileLayout showNavigation>
      <div className="px-4 py-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button disabled={!canGoPrev} onClick={() => canGoPrev && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className={`rounded-full p-2 ${canGoPrev ? panel : 'opacity-30'}`}><ChevronLeft /></button>
          <div className="text-center">
            <div className="text-[18px] font-bold">{currentBudget.title}</div>
            <div className="text-[12px] text-[#6a7b70]">{monthRange(currentMonth, language)}</div>
            {currentBudget.collaborators.length > 0 && (
              <div className="mt-2 flex items-center justify-center gap-2 text-[12px] text-[#577060]">
                <UserCircle2 size={16} /> {currentBudget.collaborators[0]}
              </div>
            )}
          </div>
          <button disabled={!canGoNext} onClick={() => canGoNext && setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className={`rounded-full p-2 ${canGoNext ? panel : 'opacity-30'}`}><ChevronRight /></button>
        </div>

        <div className={`rounded-[28px] ${panel} shadow-sm p-4`}>
          <div className="mx-auto h-[280px] w-full max-w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={82} outerRadius={112} strokeWidth={0}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none -mt-[200px] text-center">
              <div className="text-[10px] text-[#6a7b70]">{language === 'fr' ? 'Budget mensuel' : 'Monthly Budget'}</div>
              <div className="text-[16px] font-extrabold">{formatMoney(currentBudget.monthlyBudget, currency)}</div>
              <div className="mt-1 text-[10px] text-[#6a7b70]">{language === 'fr' ? 'Dépensé' : 'Spent'}</div>
              <div className="text-[15px] font-bold text-[#d95b62]">{formatMoney(totalSpent, currency)}</div>
              <div className="mt-1 text-[10px] text-[#6a7b70]">{language === 'fr' ? 'Restant' : 'Remaining'}</div>
              <div className="text-[15px] font-bold text-[#3d9b5d]">{formatMoney(remaining, currency)}</div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button onClick={() => setShowEdit(true)} className="flex-1 rounded-2xl bg-[#edf5ef] px-4 py-3 text-[14px] font-semibold text-[#163321] flex items-center justify-center gap-2"><Edit2 size={16} /> {t(language, 'editBudget')}</button>
            <button onClick={() => setShowCollaborator(true)} className="flex-1 rounded-2xl bg-[#edf5ef] px-4 py-3 text-[14px] font-semibold text-[#163321] flex items-center justify-center gap-2"><UserPlus size={16} /> {t(language, 'addCollaborator')}</button>
          </div>

          <div className="mt-3">
            <button onClick={() => setShowExport((s) => !s)} className="w-full rounded-2xl bg-[#3d9b5d] px-4 py-3 text-[14px] font-semibold text-white flex items-center justify-center gap-2"><Download size={16} /> {t(language, 'export')}</button>
            {showExport && (
              <div className="mt-2 rounded-2xl border border-black/5 bg-[#f8fbf8] p-2">
                <button onClick={() => handleExport('pdf')} className="w-full rounded-xl px-3 py-2 text-left text-[14px] hover:bg-white">{t(language, 'exportPdf')}</button>
                <button onClick={() => handleExport('csv')} className="w-full rounded-xl px-3 py-2 text-left text-[14px] hover:bg-white">{t(language, 'exportCsv')}</button>
                <button onClick={() => handleExport('json')} className="w-full rounded-xl px-3 py-2 text-left text-[14px] hover:bg-white">{t(language, 'exportJson')}</button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {currentBudget.categories.map((cat) => {
            const Icon = getIconComponent(cat.icon);
            const pct = Math.round((cat.spentAmount / Math.max(cat.expectedAmount, 1)) * 100);
            return (
              <div key={cat.id} className={`rounded-[24px] ${panel} p-4 shadow-sm`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2" style={{ backgroundColor: `${cat.color}20` }}><Icon size={18} color={cat.color} /></div>
                    <div>
                      <div className="text-[16px] font-bold" style={{ color: cat.color }}>{cat.name}</div>
                      <div className="text-[11px] text-[#6a7b70]">{cat.subCategories?.join(' • ')}</div>
                    </div>
                  </div>
                  <div className="text-right text-[13px] font-semibold">{formatMoney(cat.spentAmount, currency)} / {formatMoney(cat.expectedAmount, currency)}</div>
                </div>
                <div className="h-3 rounded-full bg-black/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showEdit && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[340px] rounded-[28px] bg-white p-5 text-[#163321] shadow-xl">
            <div className="mb-4 text-[20px] font-bold">{t(language, 'editBudget')}</div>
            <div className="space-y-3">
              <input className="w-full rounded-xl border px-4 py-3" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder={t(language, 'title')} />
              <select className="w-full rounded-xl border px-4 py-3" value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value as any })}>
                <option value="monthly">{t(language, 'monthly')}</option>
                <option value="biweekly">{t(language, 'biweekly')}</option>
                <option value="weekly">{t(language, 'weekly')}</option>
              </select>
              <input type="date" className="w-full rounded-xl border px-4 py-3" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
              <input type="date" className="w-full rounded-xl border px-4 py-3" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowEdit(false)} className="flex-1 rounded-xl border px-4 py-3">{t(language, 'cancel')}</button>
              <button onClick={() => { updateBudget(currentBudget.id, draft); setShowEdit(false); }} className="flex-1 rounded-xl bg-[#3d9b5d] px-4 py-3 font-semibold text-white">{t(language, 'save')}</button>
            </div>
          </div>
        </div>
      )}

      {showCollaborator && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[340px] rounded-[28px] bg-white p-5 text-[#163321] shadow-xl">
            <div className="mb-4 text-[20px] font-bold">{t(language, 'inviteCollaborator')}</div>
            <input className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'emailAddress')} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            {error && <div className="mt-2 text-[13px] text-red-600">{error}</div>}
            {currentBudget.collaborators.length > 0 && (
              <div className="mt-4 rounded-2xl bg-[#f5f7f5] p-3">
                <div className="mb-2 text-[13px] font-semibold">Current collaborator</div>
                <div className="flex items-center justify-between text-[14px]">
                  <span>{currentBudget.collaborators[0]}</span>
                  <button onClick={() => removeCollaborator(currentBudget.id, currentBudget.collaborators[0])} className="text-red-600 flex items-center gap-1"><Trash2 size={14} /> {t(language, 'removeCollaborator')}</button>
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setShowCollaborator(false); setError(''); }} className="flex-1 rounded-xl border px-4 py-3">{t(language, 'cancel')}</button>
              <button onClick={handleCollaboratorInvite} className="flex-1 rounded-xl bg-[#3d9b5d] px-4 py-3 font-semibold text-white">{t(language, 'save')}</button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};
