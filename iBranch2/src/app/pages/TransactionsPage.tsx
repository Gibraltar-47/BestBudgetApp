import React, { useMemo, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { Plus, Filter, Search, Edit2, Trash2, X, Download, Upload, Building2, FileText, ChevronDown } from 'lucide-react';
import { Transaction } from '../types';
import * as LucideIcons from 'lucide-react';
import { t } from '../i18n';
import { exportJson, exportSimplePdf, exportTransactionsCsv, formatDateLong, formatMoney } from '../utils';

const getIconComponent = (iconName: string) => (LucideIcons as any)[iconName] || LucideIcons.Circle;

export const TransactionsPage: React.FC = () => {
  const { transactions, currentMonth, currentBudget, currency, language, addTransaction, updateTransaction, deleteTransaction, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'merchant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({ merchant: '', amount: '', category: '', subCategory: '', date: currentMonth.toISOString().slice(0, 10), recurring: false });

  const monthTransactions = useMemo(() => transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  }), [transactions, currentMonth]);

  const filteredTransactions = useMemo(() => {
    const list = monthTransactions.filter((t) => {
      const matchesSearch = !searchTerm || [t.merchant, t.category, t.subCategory ?? ''].some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    return list.sort((a, b) => {
      const factor = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'date') return (new Date(a.date).getTime() - new Date(b.date).getTime()) * factor;
      if (sortBy === 'amount') return (a.amount - b.amount) * factor;
      return a.merchant.localeCompare(b.merchant) * factor;
    });
  }, [monthTransactions, searchTerm, filterCategory, sortBy, sortOrder]);

  const categories = currentBudget?.categories ?? [];
  const panel = theme === 'dark' ? 'bg-[#1d2523] text-white' : 'bg-white text-[#163321]';

  const startEditing = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      merchant: transaction.merchant,
      amount: String(transaction.amount),
      category: transaction.category,
      subCategory: transaction.subCategory ?? '',
      date: transaction.date,
      recurring: !!transaction.recurring,
    });
  };

  const saveTransaction = () => {
    const payload = { merchant: formData.merchant, amount: Number(formData.amount), category: formData.category, subCategory: formData.subCategory, date: formData.date, recurring: formData.recurring };
    if (selectedTransaction) updateTransaction(selectedTransaction.id, payload);
    else addTransaction(payload);
    setSelectedTransaction(null);
    setShowAddTransaction(false);
    setFormData({ merchant: '', amount: '', category: '', subCategory: '', date: currentMonth.toISOString().slice(0, 10), recurring: false });
  };

  const handleExport = (kind: 'pdf' | 'csv' | 'json') => {
    const lines = filteredTransactions.map((tx) => `${tx.date} • ${tx.merchant} • ${tx.category}${tx.subCategory ? `/${tx.subCategory}` : ''} • ${tx.amount}`);
    if (kind === 'pdf') exportSimplePdf('Transactions', lines, 'transactions.pdf');
    if (kind === 'csv') exportTransactionsCsv(filteredTransactions);
    if (kind === 'json') exportJson(filteredTransactions, 'transactions.json');
    setShowExportMenu(false);
  };

  return (
    <MobileLayout showNavigation>
      <div className="px-4 py-5">
        <h1 className="mb-4 text-[24px] font-bold">{t(language, 'transactions')}</h1>

        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search transactions..." className="w-full rounded-2xl border border-[#d8dfda] pl-10 pr-4 py-3" />
            </div>
            <button onClick={() => setShowFilters((s) => !s)} className={`rounded-2xl px-4 ${panel} border border-black/5 flex items-center gap-2`}>
              <Filter size={18} /> <ChevronDown size={16} />
            </button>
          </div>
          {showFilters && (
            <div className={`rounded-[24px] ${panel} p-4 border border-black/5`}>
              <div className="grid grid-cols-2 gap-3">
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="rounded-xl border px-3 py-3 bg-transparent">
                  <option value="all">{t(language, 'allCategories')}</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="rounded-xl border px-3 py-3 bg-transparent">
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="merchant">Merchant</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="rounded-xl border px-3 py-3">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</button>
                <button onClick={() => { setFilterCategory('all'); setSortBy('date'); setSortOrder('desc'); setSearchTerm(''); }} className="rounded-xl border px-3 py-3">Reset</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const categoryMeta = categories.find((cat) => cat.name === transaction.category);
            const Icon = getIconComponent(categoryMeta?.icon ?? 'Circle');
            return (
              <button key={transaction.id} onClick={() => startEditing(transaction)} className={`w-full rounded-[24px] ${panel} p-4 shadow-sm text-left border border-black/5`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-full p-2 shrink-0" style={{ backgroundColor: `${categoryMeta?.color ?? '#8aa'}20` }}>
                      <Icon size={18} color={categoryMeta?.color ?? '#577060'} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold">{transaction.merchant}</div>
                      <div className="text-[12px] text-[#6a7b70]">{transaction.category}{transaction.subCategory ? ` • ${transaction.subCategory}` : ''}</div>
                      <div className="text-[12px] text-[#6a7b70]">{formatDateLong(transaction.date, language)}</div>
                    </div>
                  </div>
                  <div className="text-[15px]">{formatMoney(transaction.amount, currency)}</div>
                </div>
              </button>
            );
          })}
          {filteredTransactions.length === 0 && <div className="py-12 text-center text-[#6a7b70]">{t(language, 'noTransactions')}</div>}
        </div>

        <div className="pointer-events-none absolute bottom-[92px] right-4 z-20 flex flex-col gap-3">
          <button onClick={() => setShowExportMenu((s) => !s)} className="pointer-events-auto rounded-full bg-[#163321] p-4 text-white shadow-lg"><Download size={20} /></button>
          <button onClick={() => { setSelectedTransaction(null); setShowAddTransaction(true); }} className="pointer-events-auto rounded-full bg-[#3d9b5d] p-4 text-white shadow-lg"><Plus size={22} /></button>
        </div>
      </div>

      {showAddMenu && null}
      {showExportMenu && (
        <div className="absolute inset-0 z-40 bg-black/20" onClick={() => setShowExportMenu(false)}>
          <div className="absolute bottom-[150px] right-4 w-[210px] rounded-[24px] bg-white p-3 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => handleExport('pdf')} className="w-full rounded-xl px-3 py-2 text-left hover:bg-[#f4f7f4] flex items-center gap-2"><FileText size={16} /> {t(language, 'exportPdf')}</button>
            <button onClick={() => handleExport('csv')} className="w-full rounded-xl px-3 py-2 text-left hover:bg-[#f4f7f4] flex items-center gap-2"><Download size={16} /> {t(language, 'exportCsv')}</button>
            <button onClick={() => handleExport('json')} className="w-full rounded-xl px-3 py-2 text-left hover:bg-[#f4f7f4] flex items-center gap-2"><Download size={16} /> {t(language, 'exportJson')}</button>
          </div>
        </div>
      )}

      {showAddTransaction && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[340px] rounded-[28px] bg-white p-5 text-[#163321] shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[20px] font-bold">{t(language, 'addTransaction')}</div>
              <button onClick={() => setShowAddTransaction(false)}><X /></button>
            </div>
            <div className="space-y-3">
              <input className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'merchant')} value={formData.merchant} onChange={(e) => setFormData({ ...formData, merchant: e.target.value })} />
              <input type="number" className="w-full rounded-xl border px-4 py-3" placeholder={t(language, 'amount')} value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
              <select className="w-full rounded-xl border px-4 py-3" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value, subCategory: '' })}>
                <option value="">{t(language, 'category')}</option>
                {categories.map((cat) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
              <select className="w-full rounded-xl border px-4 py-3" value={formData.subCategory} onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}>
                <option value="">{t(language, 'subCategory')}</option>
                {(categories.find((cat) => cat.name === formData.category)?.subCategories ?? []).map((sub) => <option key={sub} value={sub}>{sub}</option>)}
              </select>
              <input type="date" className="w-full rounded-xl border px-4 py-3" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" checked={formData.recurring} onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })} /> {t(language, 'recurring')}</label>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => alert(t(language, 'comingSoon'))} className="rounded-xl border px-4 py-3 flex items-center justify-center gap-2"><Building2 size={16} /> {t(language, 'importFromBank')}</button>
                <button onClick={saveTransaction} className="rounded-xl bg-[#3d9b5d] px-4 py-3 font-semibold text-white flex items-center justify-center gap-2"><Upload size={16} /> {t(language, 'save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTransaction && !showAddTransaction && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[340px] rounded-[28px] bg-white p-5 text-[#163321] shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[20px] font-bold">{t(language, 'viewDetails')}</div>
              <button onClick={() => setSelectedTransaction(null)}><X /></button>
            </div>
            <div className="space-y-2 text-[14px]">
              <div><strong>{t(language, 'merchant')}:</strong> {selectedTransaction.merchant}</div>
              <div><strong>{t(language, 'amount')}:</strong> {formatMoney(selectedTransaction.amount, currency)}</div>
              <div><strong>{t(language, 'category')}:</strong> {selectedTransaction.category}</div>
              <div><strong>{t(language, 'subCategory')}:</strong> {selectedTransaction.subCategory || '-'}</div>
              <div><strong>{t(language, 'date')}:</strong> {formatDateLong(selectedTransaction.date, language)}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowAddTransaction(true)} className="flex-1 rounded-xl border px-4 py-3 flex items-center justify-center gap-2"><Edit2 size={16} /> {t(language, 'edit')}</button>
              <button onClick={() => { deleteTransaction(selectedTransaction.id); setSelectedTransaction(null); }} className="flex-1 rounded-xl border border-red-200 px-4 py-3 text-red-600 flex items-center justify-center gap-2"><Trash2 size={16} /> {t(language, 'delete')}</button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};
