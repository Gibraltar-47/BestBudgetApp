import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logo from '../../assets/ibudget-logo-transparent.png';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    confirmEmail: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { signup, theme, language } = useApp();
  const navigate = useNavigate();

  const copy = useMemo(
    () =>
      language === 'fr'
        ? {
            title: 'Créer un compte',
            subtitle: 'Configurez votre profil pour commencer à bâtir un budget plus intelligent.',
            create: 'Créer le compte',
            back: 'Retour à la connexion',
            mismatch: 'Les courriels ne correspondent pas',
          }
        : {
            title: 'Create Account',
            subtitle: 'Set up your profile to start building a smarter budget.',
            create: 'Create Account',
            back: 'Back to login',
            mismatch: 'Emails do not match',
          },
    [language],
  );

  const fields = [
    ['firstName', 'First Name', 'text'],
    ['lastName', 'Last Name', 'text'],
    ['dateOfBirth', 'Date of Birth', 'date'],
    ['email', 'Email', 'email'],
    ['confirmEmail', 'Confirm Email', 'email'],
    ['username', 'Username', 'text'],
    ['password', 'Password', 'password'],
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.email !== formData.confirmEmail) {
      setError(copy.mismatch);
      return;
    }
    if (signup(formData)) {
      alert('Account created! Please log in with your credentials.');
      navigate('/');
    }
  };

  return (
    <div className={`min-h-full px-6 py-8 ${theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-gradient-to-b from-[#f2f7f4] to-[#e3eee7] text-[#163223]'}`} style={{ maxWidth: '393px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-sm font-semibold text-emerald-500">
        <ArrowLeft size={16} />
        {copy.back}
      </button>

      <div className={`rounded-[30px] border p-6 shadow-xl ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-[#d7e6de] bg-white/95'}`}>
        <div className="mb-6 text-center">
          <img src={logo} alt="iBudget" className="mx-auto h-20 w-20 object-contain" />
          <h1 className="mt-3 text-[28px] font-extrabold">{copy.title}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{copy.subtitle}</p>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map(([name, label, type]) => (
            <div key={name}>
              <label className="mb-1 block text-sm font-semibold">{label}</label>
              <input
                type={type}
                name={name}
                value={(formData as any)[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"
                required
              />
            </div>
          ))}

          <button type="submit" className="mt-4 w-full rounded-2xl bg-emerald-500 py-3 text-base font-bold text-white shadow-md hover:bg-emerald-600">
            {copy.create}
          </button>
        </form>
      </div>
    </div>
  );
};
