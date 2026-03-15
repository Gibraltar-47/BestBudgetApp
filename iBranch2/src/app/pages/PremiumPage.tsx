import React from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Star } from 'lucide-react';
import { t } from '../i18n';

export const PremiumPage: React.FC = () => {
  const { language, theme } = useApp();
  const panel = theme === 'dark' ? 'bg-[#1d2523] text-white' : 'bg-white text-[#163321]';
  const perks = [
    'Unlimited collaborators',
    'More budget templates',
    'Richer exports and premium insights',
    'Advanced customization',
  ];
  const perksFr = [
    'Collaborateurs illimités',
    'Plus de modèles de budget',
    'Exports enrichis et analyses premium',
    'Personnalisation avancée',
  ];
  const items = language === 'fr' ? perksFr : perks;
  return (
    <MobileLayout showNavigation>
      <div className="px-4 py-5">
        <div className={`rounded-[28px] ${panel} p-6 shadow-sm`}>
          <div className="mb-3 flex items-center gap-3"><Star className="text-[#d6a11f]" /><h1 className="text-[24px] font-bold">{t(language, 'premiumPerks')}</h1></div>
          <p className="mb-5 text-[14px] text-[#6a7b70]">{t(language, 'premiumDescription')}</p>
          <div className="space-y-3">
            {items.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl bg-black/5 p-3"><CheckCircle2 size={18} className="text-[#3d9b5d]" /> {item}</div>)}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};
