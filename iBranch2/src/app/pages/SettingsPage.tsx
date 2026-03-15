import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Globe, DollarSign, User, Save, Star } from 'lucide-react';
import { t } from '../i18n';
import { CURRENCY_META } from '../utils';

export const SettingsPage: React.FC = () => {
  const { currentUser, theme, setTheme, language, setLanguage, currency, setCurrency, updateUserProfile } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ firstName: currentUser?.firstName ?? '', lastName: currentUser?.lastName ?? '', email: currentUser?.email ?? '', phone: currentUser?.phone ?? '' });
  const navigate = useNavigate();
  const panel = theme === 'dark' ? 'bg-[#1d2523] text-white' : 'bg-white text-[#163321]';

  return (
    <MobileLayout showNavigation>
      <div className="px-4 py-5">
        <h1 className="mb-4 text-[24px] font-bold">{t(language, 'settings')}</h1>

        <div className={`mb-4 rounded-[28px] ${panel} p-5 shadow-sm`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[18px] font-bold"><User size={20} /> {t(language, 'profileInformation')}</h2>
            {!editMode && <button onClick={() => setEditMode(true)} className="text-[#3d9b5d]">{t(language, 'edit')}</button>}
          </div>
          {editMode ? (
            <div className="space-y-3">
              {['firstName', 'lastName', 'email', 'phone'].map((field) => (
                <input key={field} className="w-full rounded-xl border px-4 py-3 text-[#163321]" value={(formData as any)[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} placeholder={field} />
              ))}
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setEditMode(false)} className="rounded-xl border px-4 py-3">{t(language, 'cancel')}</button>
                <button onClick={() => { updateUserProfile(formData); setEditMode(false); }} className="rounded-xl bg-[#3d9b5d] px-4 py-3 font-semibold text-white flex items-center justify-center gap-2"><Save size={16} /> {t(language, 'save')}</button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-[14px]">
              <div>{t(language, 'name')}: {currentUser?.firstName} {currentUser?.lastName}</div>
              <div>Email: {currentUser?.email}</div>
              <div>{t(language, 'phone')}: {currentUser?.phone}</div>
              <div>{t(language, 'plan')}: <span className="capitalize">{currentUser?.plan}</span></div>
            </div>
          )}
        </div>

        <div className={`mb-4 rounded-[28px] ${panel} p-5 shadow-sm`}>
          <h2 className="mb-4 flex items-center gap-2 text-[18px] font-bold">{theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />} {t(language, 'appearance')}</h2>
          <div className="flex items-center justify-between">
            <span>{t(language, 'darkMode')}</span>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`h-[30px] w-[54px] rounded-full ${theme === 'dark' ? 'bg-[#3d9b5d]' : 'bg-gray-300'}`}>
              <div className={`h-[24px] w-[24px] rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-[27px]' : 'translate-x-[3px]'}`} />
            </button>
          </div>
        </div>

        <div className={`mb-4 rounded-[28px] ${panel} p-5 shadow-sm`}>
          <h2 className="mb-4 flex items-center gap-2 text-[18px] font-bold"><Globe size={20} /> {t(language, 'language')}</h2>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setLanguage('en')} className={`rounded-xl px-4 py-3 ${language === 'en' ? 'bg-[#3d9b5d] text-white' : 'bg-black/5'}`}>English</button>
            <button onClick={() => setLanguage('fr')} className={`rounded-xl px-4 py-3 ${language === 'fr' ? 'bg-[#3d9b5d] text-white' : 'bg-black/5'}`}>Français</button>
          </div>
        </div>

        <div className={`mb-4 rounded-[28px] ${panel} p-5 shadow-sm`}>
          <h2 className="mb-4 flex items-center gap-2 text-[18px] font-bold"><DollarSign size={20} /> {t(language, 'currency')}</h2>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-xl border px-4 py-3 text-[#163321]">
            {Object.entries(CURRENCY_META).map(([code, meta]) => <option key={code} value={code}>{meta.label}</option>)}
          </select>
          <div className="mt-2 text-[12px] text-[#6a7b70]">CAD base amounts are converted for display using hardcoded current approximate rates.</div>
        </div>

        <div className={`rounded-[28px] ${panel} p-5 shadow-sm`}>
          <h2 className="mb-3 text-[18px] font-bold">{t(language, 'about')}</h2>
          <p className="text-[14px] text-[#6a7b70]">Version 1.0.0</p>
          <p className="mt-2 text-[14px] text-[#6a7b70]">iBudget helps you manage your finances and grow your financial future.</p>
          <button onClick={() => navigate('/premium')} className="mt-4 w-full rounded-xl bg-[#163321] px-4 py-3 text-white flex items-center justify-center gap-2"><Star size={16} /> {t(language, 'learnMore')}</button>
        </div>
      </div>
    </MobileLayout>
  );
};
