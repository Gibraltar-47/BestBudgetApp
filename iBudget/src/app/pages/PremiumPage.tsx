import React from 'react';
import { CheckCircle2, Crown, Users, Sparkles } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';

export const PremiumPage: React.FC = () => {
  const perks = [
    { icon: <Users size={18} />, title: 'Unlimited collaborators', text: 'Invite as many people as you need to manage shared budgets together.' },
    { icon: <Sparkles size={18} />, title: 'Advanced analytics', text: 'See cleaner spending trends, better summaries, and more export options.' },
    { icon: <CheckCircle2 size={18} />, title: 'Priority tools', text: 'Get premium templates, polished reports, and future bank integrations first.' },
  ];

  return (
    <MobileLayout showNavigation>
      <div className="px-4 pb-8 pt-4">
        <div className="rounded-[30px] bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <Crown size={28} />
          </div>
          <h1 className="text-3xl font-extrabold">Premium perks</h1>
          <p className="mt-2 text-sm text-white/90">Everything you need to build budgets faster, collaborate better, and export polished results.</p>
        </div>
        <div className="mt-4 space-y-3">
          {perks.map((perk) => (
            <div key={perk.title} className="rounded-[24px] border border-[#dce8e1] bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-2 flex items-center gap-2 text-emerald-500">{perk.icon}<p className="text-lg font-extrabold text-inherit">{perk.title}</p></div>
              <p className="text-sm text-slate-500">{perk.text}</p>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};
