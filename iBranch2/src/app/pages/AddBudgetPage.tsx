import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MobileLayout } from '../components/MobileLayout';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';
import { t } from '../i18n';

export const AddBudgetPage: React.FC = () => {
  const { currentUser, addBudget, theme, language } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState('Untitled');
  const [amount, setAmount] = useState('0');
  const [period, setPeriod] = useState<'weekly' | 'biweekly' | 'monthly'>('monthly');
  const [categories, setCategories] = useState([
    { name: 'Food', expectedAmount: 0, subCategories: ['Groceries', 'Takeout'], color: '#F56BB9', icon: 'UtensilsCrossed' },
  ]);
  const panel = theme === 'dark' ? 'bg-[#1d2523] text-white' : 'bg-white text-[#163321]';

  return (
    <MobileLayout showNavigation>
      <div className="px-4 py-5">
        <h1 className="mb-4 text-[24px] font-bold">{t(language, 'createBudget')}</h1>
        <div className={`rounded-[28px] ${panel} p-5 shadow-sm space-y-4`}>
          <input className="w-full rounded-xl border px-4 py-3 text-[#163321]" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t(language, 'title')} />
          <input type="number" className="w-full rounded-xl border px-4 py-3 text-[#163321]" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t(language, 'amount')} />
          <select className="w-full rounded-xl border px-4 py-3 text-[#163321]" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
            <option value="monthly">{t(language, 'monthly')}</option>
            <option value="biweekly">{t(language, 'biweekly')}</option>
            <option value="weekly">{t(language, 'weekly')}</option>
          </select>

          {categories.map((category, index) => (
            <div key={index} className="rounded-2xl bg-black/5 p-4 space-y-2">
              <input className="w-full rounded-xl border px-4 py-3 text-[#163321]" value={category.name} onChange={(e) => setCategories(categories.map((c, i) => i === index ? { ...c, name: e.target.value } : c))} placeholder={t(language, 'category')} />
              <input type="number" className="w-full rounded-xl border px-4 py-3 text-[#163321]" value={category.expectedAmount} onChange={(e) => setCategories(categories.map((c, i) => i === index ? { ...c, expectedAmount: Number(e.target.value) } : c))} placeholder={t(language, 'amount')} />
              <input className="w-full rounded-xl border px-4 py-3 text-[#163321]" value={category.subCategories.join(', ')} onChange={(e) => setCategories(categories.map((c, i) => i === index ? { ...c, subCategories: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } : c))} placeholder={t(language, 'subCategory')} />
            </div>
          ))}

          <button onClick={() => setCategories([...categories, { name: '', expectedAmount: 0, subCategories: [], color: '#399A57', icon: 'CircleDollarSign' }])} className="w-full rounded-xl border px-4 py-3 flex items-center justify-center gap-2"><Plus size={16} /> {t(language, 'addCategory')}</button>
          <button onClick={() => { if (!currentUser) return; addBudget({ userId: currentUser.id, title, monthlyBudget: Number(amount), period, startDate: '2026-03-01', endDate: '2026-03-30', collaborators: [], categories: categories.map((cat, index) => ({ id: `new_cat_${index}`, name: cat.name || `Category ${index+1}`, color: cat.color, icon: cat.icon, expectedAmount: cat.expectedAmount, spentAmount: 0, percentage: 0, subCategories: cat.subCategories })) }); navigate('/budget'); }} className="w-full rounded-xl bg-[#3d9b5d] px-4 py-3 font-semibold text-white">{t(language, 'save')}</button>
        </div>
      </div>
    </MobileLayout>
  );
};
