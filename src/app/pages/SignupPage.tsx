import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import imgMoneyTree from '../../assets/e64d974d5a01bec25d6463a6587944bee2595453.png';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', dateOfBirth: '', email: '', confirmEmail: '', username: '', password: '' });
  const [error, setError] = useState('');
  const { signup, language } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email !== formData.confirmEmail) {
      setError(language === 'fr' ? 'Les courriels ne correspondent pas' : 'Emails do not match');
      return;
    }
    signup(formData);
    alert(language === 'fr' ? 'Compte créé. Connectez-vous.' : 'Account created! Please log in.');
    navigate('/');
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#f2f5f2] to-[#dce7df] px-6 pt-12 pb-8" style={{ maxWidth: '393px', margin: '0 auto' }}>
      <div className="mb-6 text-center">
        <img src={imgMoneyTree} alt="iBudget logo" className="mx-auto mb-3 h-[76px] w-[76px] object-contain" />
        <h1 className="text-[30px] font-extrabold text-[#183423]">{t(language, 'createAccount')}</h1>
      </div>
      <div className="rounded-[26px] bg-white p-5 shadow-lg">
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-600 text-[13px]">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            ['firstName', 'First Name', 'text'],
            ['lastName', 'Last Name', 'text'],
            ['dateOfBirth', 'Date of Birth', 'date'],
            ['email', 'Email', 'email'],
            ['confirmEmail', 'Confirm Email', 'email'],
            ['username', 'Username', 'text'],
            ['password', 'Password', 'password'],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className="mb-1 block text-[13px] font-medium text-[#254434]">{label}</label>
              <input
                type={type}
                value={(formData as any)[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full rounded-xl border border-[#d8dfda] px-4 py-3 outline-none focus:border-[#3d9b5d]"
                required
              />
            </div>
          ))}
          <button type="submit" className="w-full rounded-xl bg-[#3d9b5d] py-3 font-semibold text-white">{t(language, 'signUp')}</button>
        </form>
        <button onClick={() => navigate('/')} className="mt-4 w-full text-center text-[14px] font-medium text-[#3d9b5d]">{t(language, 'login')}</button>
      </div>
    </div>
  );
};
