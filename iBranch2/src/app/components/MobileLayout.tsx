import React, { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home as HomeIcon, Receipt, TrendingUp, CreditCard, Settings, LogOut, Plus, Star, UserCircle2, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  title?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showHeader = true, showNavigation = true, title }) => {
  const { currentUser, logout, budgetTemplates, theme, setCurrentBudget, language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/budget', label: t(language, 'budget'), icon: HomeIcon },
    { path: '/transactions', label: t(language, 'transactions'), icon: Receipt },
    { path: '/analytics', label: t(language, 'analytics'), icon: TrendingUp },
    { path: '/debt-tracker', label: t(language, 'debtTracker'), icon: CreditCard },
  ];

  const themeClasses = theme === 'dark'
    ? { bg: 'bg-[#121716]', panel: 'bg-[#1d2523]', text: 'text-white', sub: 'text-slate-300', accent: 'bg-[#2d5a3d]' }
    : { bg: 'bg-[#f6f7f5]', panel: 'bg-white', text: 'text-[#163321]', sub: 'text-[#5f6f66]', accent: 'bg-[#3d9b5d]' };

  return (
    <div className={`${themeClasses.bg} ${themeClasses.text} h-full flex flex-col relative`} style={{ maxWidth: '393px', margin: '0 auto' }}>
      {showHeader && (
        <header className={`${themeClasses.accent} px-4 pt-12 pb-4 shadow-sm`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-full bg-white/15 p-1.5">
              <UserCircle2 size={34} className="text-white" />
            </button>
            <div className="flex-1 text-center pr-10">
              {title ? <h1 className="text-[17px] font-semibold text-white">{title}</h1> : <div className="h-6" />}
            </div>
          </div>
        </header>
      )}

      {sidebarOpen && (
        <>
          <div className="absolute inset-0 z-20 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className={`absolute left-0 top-0 bottom-0 z-30 w-[280px] ${themeClasses.panel} ${themeClasses.text} rounded-r-[28px] shadow-2xl flex flex-col overflow-hidden`}>
            <div className="p-5 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#3d9b5d] p-2">
                  <UserCircle2 size={42} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[18px]">{currentUser?.firstName} {currentUser?.lastName}</div>
                  <div className={`text-[12px] ${themeClasses.sub}`}>{currentUser?.plan === 'premium' ? 'Premium' : 'Basic'} plan</div>
                </div>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <div className="mb-4 text-[14px] font-semibold">{t(language, 'myBudgets')}</div>
              <div className="space-y-2 mb-5">
                {budgetTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setCurrentBudget(template);
                      navigate('/budget');
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left rounded-2xl px-4 py-3 bg-black/5 hover:bg-black/10"
                  >
                    <div className="font-medium">{template.title}</div>
                    <div className={`text-[12px] ${themeClasses.sub}`}>{template.period}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => { navigate('/add-budget'); setSidebarOpen(false); }}
                className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-[#3d9b5d] px-4 py-3 text-white"
              >
                <Plus size={18} /> {t(language, 'addBudget')}
              </button>

              <button
                onClick={() => { navigate('/settings'); setSidebarOpen(false); }}
                className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-black/5 px-4 py-3"
              >
                <Settings size={18} /> {t(language, 'accountSettings')}
              </button>

              <button
                onClick={() => { navigate('/premium'); setSidebarOpen(false); }}
                className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-black/5 px-4 py-3"
              >
                <Star size={18} /> {t(language, 'premium')}
              </button>
            </div>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="m-4 mt-0 flex items-center justify-center gap-2 rounded-2xl bg-[#e8f3ec] px-4 py-3 text-[#163321]"
            >
              <LogOut size={18} /> {t(language, 'signOut')}
            </button>
          </aside>
        </>
      )}

      <main className="flex-1 overflow-y-auto pb-[84px]">{children}</main>

      {showNavigation && (
        <nav className={`absolute bottom-0 left-0 right-0 h-[72px] ${theme === 'dark' ? 'bg-[#18211f]' : 'bg-[#dcebdd]'} border-t border-black/5 flex items-center justify-around px-2`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center rounded-2xl px-1 ${isActive ? 'bg-[#3d9b5d] text-white' : themeClasses.text}`}
              >
                <Icon size={18} />
                <span className="mt-1 text-[10px] font-semibold leading-none text-center">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => navigate('/money-tree')}
            className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-[#163321] p-3 shadow-lg"
            aria-label="Money tree"
          >
            <Wallet size={22} className="text-white" />
          </button>
        </nav>
      )}
    </div>
  );
};
