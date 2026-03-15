import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Landmark, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logo from '../../assets/ibudget-logo-transparent.png';

const bankBadges = [
  { name: 'RBC', color: '#0051A5' },
  { name: 'TD', color: '#009A44' },
  { name: 'BMO', color: '#0079C1' },
  { name: 'CIBC', color: '#8B1E2D' },
  { name: 'Scotia', color: '#E31937' },
  { name: 'NBC', color: '#1A1A1A' },
  { name: 'Desjardins', color: '#00894D' },
];

export const HomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, currentUser, theme, language } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate('/budget');
  }, [currentUser, navigate]);

  const copy = useMemo(
    () =>
      language === 'fr'
        ? {
            headline: 'Bon retour !',
            phrase: "Là où l'argent pousse dans les arbres.",
            username: "Nom d'utilisateur",
            password: 'Mot de passe',
            login: 'Se connecter',
            signup: 'Créer un compte',
            invalid: "Nom d'utilisateur ou mot de passe invalide",
            demo: 'Comptes démo',
            partnership: 'En partenariat avec',
            appName: 'iBudget',
          }
        : {
            headline: 'Welcome Back!',
            phrase: 'Where money grows on trees.',
            username: 'Username',
            password: 'Password',
            login: 'Log In',
            signup: 'Sign Up',
            invalid: 'Invalid username or password',
            demo: 'Demo Accounts',
            partnership: 'In partnership with',
            appName: 'iBudget',
          },
    [language],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) {
      setError(copy.invalid);
      return;
    }
    navigate('/budget');
  };

  const shell = theme === 'dark'
    ? 'from-slate-950 via-slate-900 to-slate-800 text-slate-50'
    : 'from-[#edf6f0] via-[#f8fbf9] to-[#dfece4] text-[#163223]';

  return (
    <div className={`min-h-full bg-gradient-to-b ${shell} px-6 py-10`} style={{ maxWidth: '393px', margin: '0 auto' }}>
      <div className="flex min-h-full flex-col items-center justify-between">
        <div className="w-full">
          <div className="mb-8 mt-6 text-center">
            <img src={logo} alt="iBudget logo" className="mx-auto h-28 w-28 object-contain" />
            <p className="mt-4 text-base font-semibold text-emerald-500">{copy.phrase}</p>
          </div>

          <div className={`mx-auto w-full max-w-[314px] rounded-[28px] border px-5 py-6 shadow-xl ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-[#d7e6de] bg-white/95'}`}>
            <div className="mb-5 text-center">
              <h1 className="text-[26px] font-extrabold">{copy.headline}</h1>
            </div>

            {error && <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">{copy.username}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"
                  placeholder={copy.username}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold">{copy.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"
                  placeholder={copy.password}
                  required
                />
              </div>
              <button type="submit" className="w-full rounded-2xl bg-emerald-500 py-3 text-base font-bold text-white shadow-md transition hover:bg-emerald-600">
                {copy.login}
              </button>
            </form>

            <button onClick={() => navigate('/signup')} className="mt-4 w-full text-sm font-semibold text-emerald-500">
              {copy.signup}
            </button>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-3 text-xs dark:border-slate-700">
              <div className="mb-2 flex items-center justify-center gap-2 font-semibold">
                <ShieldCheck size={14} className="text-emerald-500" />
                {copy.demo}
              </div>
              <div className="space-y-2 text-slate-600 dark:text-slate-300">
                <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
                  <p><strong>Fatima (Basic)</strong></p>
                  <p>Username: moneyMaker123</p>
                  <p>Password: fatimabroke123</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
                  <p><strong>Edward (Premium)</strong></p>
                  <p>Username: Eddie1997</p>
                  <p>Password: familyfirst!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 w-full max-w-[314px] rounded-[24px] border px-4 py-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
              <Landmark size={14} className="text-emerald-500" />
              {copy.partnership}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {bankBadges.map((bank) => (
                <div key={bank.name} className="rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-sm" style={{ backgroundColor: bank.color }}>
                  {bank.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm font-bold tracking-[0.35em] text-emerald-500">{copy.appName}</p>
      </div>
    </div>
  );
};
