import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import imgMoneyTree from '../../assets/Moneytree.png';

const banks = ['RBC', 'TD', 'Scotiabank', 'BMO', 'CIBC', 'National Bank', 'Desjardins'];

export const HomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, currentUser, language } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate('/budget');
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError(language === 'fr' ? 'Nom d’utilisateur ou mot de passe invalide' : 'Invalid username or password');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#eef4ef] to-[#d5e7da] px-6 pt-14 pb-10" style={{ maxWidth: '393px', margin: '0 auto' }}>
      <div className="flex flex-col items-center text-center">
        <img src={imgMoneyTree} alt="iBudget logo" className="mb-4 h-[88px] w-[88px] object-contain" />
        <h1 className="text-[34px] font-extrabold text-[#183423]">iBudget</h1>
        <p className="mt-1 text-[15px] font-medium text-[#476354]">{t(language, 'whereMoneyGrows')}</p>
      </div>

      <div className="mt-8 rounded-[24px] bg-white/95 p-5 shadow-lg">
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#254434]">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full rounded-xl border border-[#d8dfda] px-4 py-3 outline-none focus:border-[#3d9b5d]" placeholder="" />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#254434]">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-xl border border-[#d8dfda] px-4 py-3 outline-none focus:border-[#3d9b5d]" placeholder="" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-[#3d9b5d] py-3 font-semibold text-white">{t(language, 'login')}</button>
        </form>

        <button onClick={() => navigate('/signup')} className="mt-4 w-full text-center text-[14px] font-medium text-[#3d9b5d]">{t(language, 'signUp')}</button>

        <div className="mt-5 rounded-2xl bg-[#f5f7f5] p-3 text-[12px] text-[#4a5b51]">
          <div className="mb-2 text-center font-semibold">Demo Accounts</div>
          <div className="space-y-2">
            <div>
              <div><strong>Fatima (Basic)</strong></div>
              <div>Username: moneyMaker123</div>
              <div>Password: fatimabroke123</div>
            </div>
            <div>
              <div><strong>Edward (Premium)</strong></div>
              <div>Username: Eddie1997</div>
              <div>Password: familyfirst!</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] bg-white/90 p-5 shadow-md">
        <h2 className="mb-3 text-center text-[14px] font-semibold text-[#315141]">{t(language, 'partnerWith')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {banks.map((bank) => (
            <div key={bank} className="rounded-2xl border border-[#dde5df] bg-[#f8fbf8] px-3 py-3 text-center text-[12px] font-semibold text-[#395848]">
              {bank}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-[15px] font-semibold text-[#183423]">iBudget</div>
    </div>
  );
};
