import React, { useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Building2, Download, Edit2, FileJson, FileSpreadsheet, Plus, Search, Trash2, X } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';

const getCategoryMeta = (budget: any, category: string) => budget?.categories.find((item: any) => item.name === category || item.name === category.replace('Transport', 'Transportation'));
const getIconComponent = (iconName?: string) => (LucideIcons as any)[iconName || 'CircleDollarSign'] || LucideIcons.CircleDollarSign;

const downloadFile = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const TransactionsPage: React.FC = () => {
  const { transactions, currentMonth, currentBudget, addTransaction, deleteTransaction, updateTransaction, formatCurrency, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({ merchant: '', amount: '', category: '', subCategory: '', date: '2026-03-15', recurring: false });

  const monthTransactions = useMemo(
    () =>
      transactions
        .filter((t) => {
          const transDate = new Date(t.date);
          return transDate.getMonth() === currentMonth.getMonth() && transDate.getFullYear() === currentMonth.getFullYear();
        })
        .filter((t) => `${t.merchant} ${t.category} ${t.subCategory || ''}`.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, currentMonth, searchTerm],
  );

  const categories = currentBudget?.categories.map((category) => category.name) || [];
  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#dce8e1]';

  const exportTransactions = (format: 'json' | 'csv') => {
    if (format === 'json') {
      downloadFile('transactions.json', JSON.stringify(monthTransactions, null, 2), 'application/json');
    } else {
      const rows = ['Date,Merchant,Category,Sub category,Amount'];
      monthTransactions.forEach((row) => rows.push(`${row.date},${row.merchant},${row.category},${row.subCategory || ''},${row.amount}`));
      downloadFile('transactions.csv', rows.join('\n'), 'text/csv');
    }
    setShowExportMenu(false);
  };

  const submitTransaction = () => {
    const payload = {
      merchant: formData.merchant,
      amount: Number(formData.amount),
      category: formData.category,
      subCategory: formData.subCategory,
      date: formData.date,
      recurring: formData.recurring,
    };
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }
    setFormData({ merchant: '', amount: '', category: '', subCategory: '', date: '2026-03-15', recurring: false });
    setEditingTransaction(null);
    setShowAddTransaction(false);
    setSelectedTransaction(null);
  };

  return (
    <MobileLayout showNavigation>
      <div className="relative px-4 pb-8 pt-4">
        <div className="mb-4 rounded-[26px] border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-extrabold">Transactions</h1>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-3 dark:border-slate-700">
            <Search size={18} className="text-slate-400" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by merchant, category or sub-category" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>

        <div className="space-y-3">
          {monthTransactions.map((transaction) => {
            const meta = getCategoryMeta(currentBudget, transaction.category);
            const Icon = getIconComponent(meta?.icon);
            return (
              <button key={transaction.id} onClick={() => setSelectedTransaction(transaction)} className={`w-full rounded-[24px] border p-4 text-left shadow-sm ${cardBg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: meta?.color || '#2e8b57' }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold">{transaction.merchant}</p>
                        {transaction.recurring && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">Recurring</span>}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="font-semibold" style={{ color: meta?.color || '#2e8b57' }}>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.subCategory || 'General'}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-base font-extrabold">{formatCurrency(transaction.amount)}</p>
                </div>
              </button>
            );
          })}
          {monthTransactions.length === 0 && <div className="rounded-[24px] border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No transactions found for this month.</div>}
        </div>

        <div className="pointer-events-none absolute bottom-4 right-4 flex flex-col gap-3">
          <button onClick={() => setShowExportMenu(true)} className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg dark:bg-slate-700">
            <Download size={20} />
          </button>
          <button onClick={() => setShowAddMenu(true)} className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
            <Plus size={20} />
          </button>
        </div>

        {showAddMenu && (
          <MenuModal title="Transaction actions" onClose={() => setShowAddMenu(false)}>
            <ActionButton icon={<Plus size={16} />} label="Add transaction" onClick={() => { setShowAddMenu(false); setEditingTransaction(null); setShowAddTransaction(true); }} />
            <ActionButton icon={<Building2 size={16} />} label="Import from bank" onClick={() => { setShowAddMenu(false); alert('Coming soon'); }} />
          </MenuModal>
        )}

        {showExportMenu && (
          <MenuModal title="Export transactions" onClose={() => setShowExportMenu(false)}>
            <ActionButton icon={<FileJson size={16} />} label="Export as JSON" onClick={() => exportTransactions('json')} />
            <ActionButton icon={<FileSpreadsheet size={16} />} label="Export as CSV" onClick={() => exportTransactions('csv')} />
          </MenuModal>
        )}

        {selectedTransaction && (
          <MenuModal title="Transaction details" onClose={() => setSelectedTransaction(null)}>
            <div className="space-y-3 text-sm">
              <Info label="Merchant" value={selectedTransaction.merchant} />
              <Info label="Category" value={selectedTransaction.category} />
              <Info label="Sub-category" value={selectedTransaction.subCategory || 'General'} />
              <Info label="Date" value={selectedTransaction.date} />
              <Info label="Amount" value={formatCurrency(selectedTransaction.amount)} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => { setEditingTransaction(selectedTransaction); setFormData({ merchant: selectedTransaction.merchant, amount: String(selectedTransaction.amount), category: selectedTransaction.category, subCategory: selectedTransaction.subCategory || '', date: selectedTransaction.date, recurring: Boolean(selectedTransaction.recurring) }); setSelectedTransaction(null); setShowAddTransaction(true); }} className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 py-3 text-sm font-bold text-emerald-600">
                <Edit2 size={16} /> Edit
              </button>
              <button onClick={() => { deleteTransaction(selectedTransaction.id); setSelectedTransaction(null); }} className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 py-3 text-sm font-bold text-rose-600">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </MenuModal>
        )}

        {showAddTransaction && (
          <MenuModal title={editingTransaction ? 'Edit transaction' : 'Add transaction'} onClose={() => { setShowAddTransaction(false); setEditingTransaction(null); }}>
            <div className="space-y-3">
              <Input label="Merchant" value={formData.merchant} onChange={(value) => setFormData({ ...formData, merchant: value })} />
              <Input label="Amount" type="number" value={formData.amount} onChange={(value) => setFormData({ ...formData, amount: value })} />
              <Select label="Category" value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} options={categories} />
              <Input label="Sub-category" value={formData.subCategory} onChange={(value) => setFormData({ ...formData, subCategory: value })} />
              <Input label="Date" type="date" value={formData.date} onChange={(value) => setFormData({ ...formData, date: value })} />
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={formData.recurring} onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })} />
                Recurring transaction
              </label>
              <button onClick={submitTransaction} className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white">Save transaction</button>
            </div>
          </MenuModal>
        )}
      </div>
    </MobileLayout>
  );
};

const MenuModal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <>
    <div className="absolute inset-0 z-30 bg-black/40" onClick={onClose} />
    <div className="absolute left-1/2 top-1/2 z-40 w-[88%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-5 shadow-2xl dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <button onClick={onClose}><X size={18} className="text-slate-500" /></button>
      </div>
      {children}
    </div>
  </>
);

const ActionButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold dark:border-slate-700">
    <span className="text-emerald-500">{icon}</span>
    {label}
  </button>
);

const Info = ({ label, value }: { label: string; value: string }) => <div><p className="text-xs text-slate-500">{label}</p><p className="font-semibold">{value}</p></div>;
const Input = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) => <div><label className="mb-1 block text-sm font-semibold">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800" /></div>;
const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) => <div><label className="mb-1 block text-sm font-semibold">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"><option value="">Select category</option>{options.map((option) => <option key={option}>{option}</option>)}</select></div>;
