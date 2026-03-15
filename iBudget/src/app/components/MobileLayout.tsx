import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { BadgeDollarSign, CreditCard, Crown, Home as HomeIcon, LogOut, Menu, Plus, Receipt, Settings, TrendingUp, UserCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logo from '../../assets/ibudget-logo-transparent.png';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  title?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showHeader = true, showNavigation = true, title }) => {
  const { currentUser, logout, budgetTemplates, theme, setCurrentBudget, addBudget, t } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const colors = theme === 'dark'
    ? {
        shell: 'bg-slate-950 text-slate-50',
        header: 'bg-slate-900/95 border-slate-800',
        sidebar: 'bg-slate-900 border-slate-800 text-slate-100',
        card: 'bg-slate-900',
        nav: 'bg-slate-900/95 border-slate-800',
        active: 'bg-emerald-500 text-white',
        inactive: 'text-slate-300',
        icon: 'text-emerald-300',
        muted: 'text-slate-400',
      }
    : {
        shell: 'bg-[#f6f8f7] text-[#163223]',
        header: 'bg-[#eef4f1]/95 border-[#d9e7df]',
        sidebar: 'bg-[#f8fbf9] border-[#d7e6de] text-[#163223]',
        card: 'bg-white',
        nav: 'bg-[#eff5f1]/95 border-[#d9e7df]',
        active: 'bg-[#2e8b57] text-white',
        inactive: 'text-[#244133]',
        icon: 'text-[#2e8b57]',
        muted: 'text-[#6a7f73]',
      };

  const navItems = [
    { path: '/budget', label: t('budget'), icon: HomeIcon },
    { path: '/transactions', label: t('transactions'), icon: Receipt },
    { path: '/analytics', label: t('analytics'), icon: TrendingUp },
    { path: '/debt-tracker', label: t('debtTracker'), icon: CreditCard },
  ];

  return (
    <div className={`relative h-full ${colors.shell}`} style={{ maxWidth: '393px', margin: '0 auto' }}>
      {showHeader && (
        <div className={`sticky top-0 z-20 h-[78px] border-b px-4 pt-8 ${colors.header}`}>
          <div className="flex h-full items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 rounded-full p-2">
              <UserCircle2 size={30} className={colors.icon} />
            </button>
            {title ? <p className="text-sm font-semibold tracking-wide">{title}</p> : <img src={logo} alt="iBudget" className="h-10 w-10" />}
            <button onClick={() => setSidebarOpen(true)} className="rounded-full p-2">
              <Menu size={30} className={colors.icon} />
            </button>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <>
          <div className="absolute inset-0 z-30 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className={`absolute inset-y-0 left-0 z-40 w-[280px] border-r shadow-xl ${colors.sidebar}`}>
            <div className="flex h-full flex-col">
              <div className="border-b border-inherit p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                    <UserCircle2 size={34} className={colors.icon} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{currentUser?.firstName} {currentUser?.lastName}</p>
                    <p className={`text-xs ${colors.muted}`}>{currentUser?.plan === 'premium' ? 'Premium Plan' : 'Basic Plan'} Membership</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-500">{t('myBudgets')}</p>
                <div className="space-y-2">
                  {budgetTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setCurrentBudget(template);
                        setSidebarOpen(false);
                        navigate('/budget');
                      }}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold bg-black/0 hover:bg-black/5 dark:hover:bg-white/5`}
                    >
                      <div>{template.title}</div>
                      <div className={`mt-1 text-xs font-normal ${colors.muted}`}>{template.period}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const budget = addBudget();
                    setSidebarOpen(false);
                    if (budget) navigate('/budget');
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white"
                >
                  <Plus size={18} />
                  {t('addBudget')}
                </button>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      navigate('/settings');
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Settings size={18} />
                    {t('accountSettings')}
                  </button>

                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      navigate('/premium');
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Crown size={18} />
                    {t('premium')}
                  </button>
                </div>

                <div className="mt-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
                  <div className="mb-2 flex items-center gap-2">
                    <BadgeDollarSign size={18} />
                    <p className="text-sm font-bold">iBudget</p>
                  </div>
                  <p className="text-xs leading-5 text-white/90">Keep your spending organized, your goals visible, and your money growing.</p>
                </div>
              </div>

              <div className="border-t border-inherit p-4">
                <button
                  onClick={() => {
                    logout();
                    setSidebarOpen(false);
                    navigate('/');
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-left text-sm font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  <LogOut size={18} />
                  {t('signOut')}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      <div className="h-[calc(100%-78px)] overflow-y-auto pb-24">{children}</div>

      {showNavigation && (
        <div className={`absolute inset-x-0 bottom-0 z-20 border-t ${colors.nav}`}>
          <div className="grid h-[76px] grid-cols-5 items-end px-2 pb-2">
            {navItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)} className="flex h-full flex-col items-center justify-center gap-1 px-1">
                  <div className={`rounded-2xl px-3 py-2 ${isActive ? colors.active : colors.inactive}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </button>
              );
            })}

            <button onClick={() => navigate('/money-tree')} className="relative flex h-full items-center justify-center">
              <div className="absolute bottom-2 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800">
                <img src={logo} alt="Money Tree" className="h-10 w-10" />
              </div>
            </button>

            {navItems.slice(2).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)} className="flex h-full flex-col items-center justify-center gap-1 px-1">
                  <div className={`rounded-2xl px-3 py-2 ${isActive ? colors.active : colors.inactive}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
