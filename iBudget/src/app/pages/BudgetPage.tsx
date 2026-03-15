import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import * as LucideIcons from 'lucide-react';
import { CalendarDays, ChevronLeft, ChevronRight, Download, FileJson, FileSpreadsheet, Mail, Pencil, Share2, UserPlus, UsersRound, UserCircle2 } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';

const getIconComponent = (iconName: string) => (LucideIcons as any)[iconName] || LucideIcons.CircleDollarSign;

const downloadFile = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return 'Jan 15th - March 18th';
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const start = new Date(startDate).toLocaleDateString('en-CA', options);
  const end = new Date(endDate).toLocaleDateString('en-CA', options);
  return `${start} - ${end}`;
};

const monthLabel = (date: Date) => date.toLocaleString('en', { month: 'long', year: 'numeric' });

export const BudgetPage: React.FC = () => {
  const { currentUser, currentBudget, currentMonth, setCurrentMonth, minMonth, maxMonth, theme, formatCurrency, updateBudget } = useApp();
  const navigate = useNavigate();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [editValues, setEditValues] = useState({
    title: currentBudget?.title || 'Untitled',
    period: currentBudget?.period || 'monthly',
    startDate: currentBudget?.startDate || '2026-01-15',
    endDate: currentBudget?.endDate || '2026-03-18',
  });

  useEffect(() => {
    if (!currentBudget) return;
    setEditValues({
      title: currentBudget.title || 'Untitled',
      period: currentBudget.period || 'monthly',
      startDate: currentBudget.startDate || '2026-01-15',
      endDate: currentBudget.endDate || '2026-03-18',
    });
  }, [currentBudget]);

  if (!currentUser) {
    navigate('/');
    return null;
  }

  if (!currentBudget) {
    return (
      <MobileLayout showNavigation>
        <div className="flex min-h-full items-center justify-center px-6 py-8">
          <div className="rounded-[28px] border border-dashed border-emerald-300 p-8 text-center">
            <h2 className="text-2xl font-bold">No budget yet</h2>
            <p className="mt-2 text-sm text-slate-500">Create one from the sidebar to get started.</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const totalSpent = currentBudget.categories.reduce((sum, category) => sum + category.spentAmount, 0);
  const remaining = Math.max(0, currentBudget.monthlyBudget - totalSpent);
  const pieData = currentBudget.categories.map((category) => ({ name: category.name, value: category.expectedAmount, color: category.color }));
  const canGoPrevious = currentMonth > minMonth;
  const canGoNext = currentMonth < maxMonth;
  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#dce8e1]';

  const exportBudget = (format: 'json' | 'csv' | 'txt') => {
    if (format === 'json') {
      downloadFile('budget.json', JSON.stringify(currentBudget, null, 2), 'application/json');
    } else if (format === 'csv') {
      const rows = ['Category,Expected,Spent,Percentage'];
      currentBudget.categories.forEach((cat) => rows.push(`${cat.name},${cat.expectedAmount},${cat.spentAmount},${cat.percentage}`));
      downloadFile('budget.csv', rows.join('\n'), 'text/csv');
    } else {
      const content = `${currentBudget.title}\n${formatDateRange(currentBudget.startDate, currentBudget.endDate)}\n\n${currentBudget.categories
        .map((cat) => `${cat.name}: ${formatCurrency(cat.spentAmount)} / ${formatCurrency(cat.expectedAmount)}`)
        .join('\n')}`;
      downloadFile('budget-summary.txt', content, 'text/plain');
    }
    setShowExportModal(false);
  };

  return (
    <MobileLayout showNavigation>
      <div className="relative px-4 pb-8 pt-4">
        <div className="mb-5 flex items-center justify-between">
          <button disabled={!canGoPrevious} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className={`rounded-full p-2 ${canGoPrevious ? 'text-emerald-600' : 'invisible'}`}>
            <ChevronLeft size={28} />
          </button>
          <div className="text-center">
            <p className="text-xl font-extrabold">{currentBudget.title}</p>
            <p className="text-xs text-slate-500">{formatDateRange(currentBudget.startDate, currentBudget.endDate)}</p>
            {currentBudget.collaborators.length > 0 && (
              <div className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                <UsersRound size={14} className="text-emerald-500" />
                <span>{currentBudget.collaborators[0]}</span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600">
              <CalendarDays size={16} />
              {monthLabel(currentMonth)}
            </div>
          </div>
          <button disabled={!canGoNext} onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className={`rounded-full p-2 ${canGoNext ? 'text-emerald-600' : 'invisible'}`}>
            <ChevronRight size={28} />
          </button>
        </div>

        <div className={`rounded-[28px] border p-4 shadow-sm ${cardBg}`}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${theme === 'dark' ? 'bg-emerald-500/15' : 'bg-emerald-50'}`}>
                <UserCircle2 size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Monthly budget</p>
                <p className="text-2xl font-extrabold">{formatCurrency(currentBudget.monthlyBudget)}</p>
              </div>
            </div>
            <button onClick={() => setShowEditModal(true)} className="rounded-2xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-600">
              <span className="inline-flex items-center gap-2"><Pencil size={16} /> Edit</span>
            </button>
          </div>

          <div className="relative mx-auto mt-2 h-[260px] w-full max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={2} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-slate-500">Spent</p>
              <p className="text-[30px] font-extrabold">{formatCurrency(totalSpent)}</p>
              <p className="mt-1 text-sm font-semibold text-emerald-500">Remaining {formatCurrency(remaining)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {currentBudget.categories.map((category) => {
            const Icon = getIconComponent(category.icon);
            const percentage = category.expectedAmount > 0 ? Math.min((category.spentAmount / category.expectedAmount) * 100, 100) : 0;
            return (
              <div key={category.id} className={`rounded-[24px] border p-4 shadow-sm ${cardBg}`}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: category.color }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-base font-bold" style={{ color: category.color }}>{category.name}</p>
                      <p className="text-sm text-slate-500">Target {formatCurrency(category.expectedAmount)}</p>
                    </div>
                  </div>
                  <p className="text-right text-sm font-bold" style={{ color: category.color }}>{formatCurrency(category.spentAmount)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: category.color }} />
                  </div>
                  <span className="w-12 text-right text-sm font-bold" style={{ color: category.color }}>{percentage.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute bottom-4 right-4 flex flex-col gap-3">
          <button onClick={() => setShowExportModal(true)} className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
            <Download size={20} />
          </button>
          <button onClick={() => setShowCollaboratorModal(true)} className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg dark:bg-slate-700">
            <UserPlus size={20} />
          </button>
        </div>

        {showExportModal && (
          <Modal title="Export Budget" onClose={() => setShowExportModal(false)}>
            <div className="space-y-2">
              <ActionButton icon={<FileJson size={16} />} label="Export as JSON" onClick={() => exportBudget('json')} />
              <ActionButton icon={<FileSpreadsheet size={16} />} label="Export as CSV" onClick={() => exportBudget('csv')} />
              <ActionButton icon={<Share2 size={16} />} label="Export summary" onClick={() => exportBudget('txt')} />
            </div>
          </Modal>
        )}

        {showEditModal && (
          <Modal title="Edit Budget" onClose={() => setShowEditModal(false)}>
            <div className="space-y-3">
              <Input label="Title" value={editValues.title} onChange={(value) => setEditValues({ ...editValues, title: value })} />
              <Input label="Period" value={editValues.period} onChange={(value) => setEditValues({ ...editValues, period: value as any })} />
              <Input label="Start date" type="date" value={editValues.startDate} onChange={(value) => setEditValues({ ...editValues, startDate: value })} />
              <Input label="End date" type="date" value={editValues.endDate} onChange={(value) => setEditValues({ ...editValues, endDate: value })} />
              <button
                onClick={() => {
                  updateBudget(currentBudget.id, editValues);
                  setShowEditModal(false);
                }}
                className="w-full rounded-2xl bg-emerald-500 py-3 font-bold text-white"
              >
                Save changes
              </button>
            </div>
          </Modal>
        )}

        {showCollaboratorModal && (
          <Modal title="Invite collaborator" onClose={() => setShowCollaboratorModal(false)}>
            <div className="space-y-3">
              <Input label="Collaborator email" type="email" value={inviteEmail} onChange={setInviteEmail} placeholder="email@example.com" />
              <button
                onClick={() => {
                  if (!inviteEmail) return;
                  const name = inviteEmail.split('@')[0].split('.').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
                  updateBudget(currentBudget.id, { collaborators: [...currentBudget.collaborators, name] });
                  setInviteEmail('');
                  setShowCollaboratorModal(false);
                  alert(`Invitation sent to ${inviteEmail}`);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 font-bold text-white"
              >
                <Mail size={16} /> Send invitation
              </button>
            </div>
          </Modal>
        )}
      </div>
    </MobileLayout>
  );
};

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <>
    <div className="absolute inset-0 z-30 bg-black/40" onClick={onClose} />
    <div className="absolute left-1/2 top-1/2 z-40 w-[88%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-5 shadow-2xl dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <button onClick={onClose} className="text-sm font-semibold text-slate-500">Close</button>
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

const Input = ({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) => (
  <div>
    <label className="mb-1 block text-sm font-semibold">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800" />
  </div>
);
