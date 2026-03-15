import React, { useMemo, useState } from 'react';
import { DollarSign, Globe, Moon, Save, Star, Sun, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { currentUser, theme, language, currency, setTheme, setLanguage, setCurrency, updateUserProfile, formatCurrency } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ firstName: currentUser?.firstName || '', lastName: currentUser?.lastName || '', email: currentUser?.email || '', phone: currentUser?.phone || '' });
  const navigate = useNavigate();

  const copy = useMemo(
    () =>
      language === 'fr'
        ? { title: 'Paramètres', profile: 'Profil', appearance: 'Apparence', translation: 'Traduction', currency: 'Devise', darkMode: 'Mode sombre', save: 'Enregistrer', premium: 'Passer à Premium' }
        : { title: 'Settings', profile: 'Profile', appearance: 'Appearance', translation: 'Translation', currency: 'Currency', darkMode: 'Dark mode', save: 'Save', premium: 'Upgrade to Premium' },
    [language],
  );

  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#dce8e1]';

  return (
    <MobileLayout showNavigation>
      <div className="px-4 pb-8 pt-4">
        <h1 className="mb-4 text-2xl font-extrabold">{copy.title}</h1>

        <div className={`mb-4 rounded-[28px] border p-5 shadow-sm ${cardBg}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><User size={18} /> {copy.profile}</h2>
            {!editMode && <button onClick={() => setEditMode(true)} className="text-sm font-semibold text-emerald-500">Edit</button>}
          </div>
          {editMode ? (
            <div className="space-y-3">
              <Input label="First Name" value={formData.firstName} onChange={(value) => setFormData({ ...formData, firstName: value })} />
              <Input label="Last Name" value={formData.lastName} onChange={(value) => setFormData({ ...formData, lastName: value })} />
              <Input label="Email" value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} />
              <Input label="Phone" value={formData.phone} onChange={(value) => setFormData({ ...formData, phone: value })} />
              <button onClick={() => { updateUserProfile(formData); setEditMode(false); }} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 font-bold text-white"><Save size={16} /> {copy.save}</button>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <Row label="Name" value={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()} />
              <Row label="Email" value={currentUser?.email || ''} />
              <Row label="Phone" value={currentUser?.phone || ''} />
              <Row label="Plan" value={currentUser?.plan || ''} />
            </div>
          )}
        </div>

        <div className={`mb-4 rounded-[28px] border p-5 shadow-sm ${cardBg}`}>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold">{theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} {copy.appearance}</h2>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold dark:bg-slate-800">
            <span>{copy.darkMode}</span>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">{theme === 'dark' ? 'On' : 'Off'}</span>
          </button>
        </div>

        <div className={`mb-4 rounded-[28px] border p-5 shadow-sm ${cardBg}`}>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold"><Globe size={18} /> {copy.translation}</h2>
          <div className="grid grid-cols-2 gap-3">
            <ToggleButton active={language === 'en'} label="English" onClick={() => setLanguage('en')} />
            <ToggleButton active={language === 'fr'} label="Français" onClick={() => setLanguage('fr')} />
          </div>
        </div>

        <div className={`mb-4 rounded-[28px] border p-5 shadow-sm ${cardBg}`}>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold"><DollarSign size={18} /> {copy.currency}</h2>
          <div className="grid grid-cols-2 gap-3">
            {['CAD', 'USD', 'EUR', 'GBP'].map((code) => (
              <ToggleButton key={code} active={currency === code} label={`${code} · ${formatCurrency(100)}`} onClick={() => setCurrency(code as any)} />
            ))}
          </div>
        </div>

        {currentUser?.plan === 'basic' && (
          <div className="rounded-[28px] bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Star size={18} /> {copy.premium}</div>
            <p className="mb-4 text-sm text-white/90">Unlock unlimited collaborators, advanced exports, and cleaner insights with Premium.</p>
            <button onClick={() => navigate('/premium')} className="w-full rounded-2xl bg-white py-3 text-sm font-bold text-emerald-600">Learn more</button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800"><span className="text-slate-500">{label}</span><span className="font-semibold">{value}</span></div>;
const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => <div><label className="mb-1 block text-sm font-semibold">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800" /></div>;
const ToggleButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => <button onClick={onClick} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${active ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-200'}`}>{label}</button>;
