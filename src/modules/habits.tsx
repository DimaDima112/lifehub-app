import { useState } from 'react';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import type { ThemeColor } from '../store/types';

export default function Habits() {
  const { habits, addHabit, deleteHabit } = useStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState<ThemeColor>('blue');
  const [category, setCategory] = useState<'mind' | 'strength' | 'endurance' | 'other'>('mind');

  const submit = () => {
    if (!name.trim()) return;
    addHabit({ name: name.trim(), category, color, dailyTarget: 1, logs: {} });
    setName('');
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Мои привычки</h1>

      <div className="neo-inset p-4 mb-6 space-y-3">
        <p className="text-sm font-bold text-main uppercase tracking-wide">Создать привычку</p>
        <input 
          className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" 
          placeholder="Название (например, Учить немецкий)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && submit()} 
        />
        <div className="flex gap-2">
          <select 
            className="flex-1 neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" 
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
          >
            <option value="mind">🧠 Ум</option>
            <option value="strength">💪 Сила</option>
            <option value="endurance">🏃 Выносливость</option>
            <option value="other">🌟 Другое</option>
          </select>
          <select 
            className="flex-1 neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" 
            value={color}
            onChange={(e) => setColor(e.target.value as ThemeColor)}
          >
            {Object.keys(colorMap).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="neo-accent px-5 rounded-lg text-lg" onClick={submit}>+</button>
        </div>
      </div>

      <h2 className="font-bold text-sm mb-2 text-main uppercase tracking-wide">Список привычек</h2>
      <div className="space-y-2">
        {habits.map((h) => {
          const c = colorMap[h.color];
          return (
            <div key={h.id} className="flex items-center gap-3 p-3 neo-raised">
              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.hex }} />
              <div className="flex-1">
                <span className="font-bold text-sm block" style={{ color: c.hex }}>{h.name}</span>
                <span className="text-[10px] text-muted uppercase">
                  {h.category === 'mind' ? 'Ум' : h.category === 'strength' ? 'Сила' : h.category === 'endurance' ? 'Выносливость' : 'Другое'}
                </span>
              </div>
              <button className="text-muted hover:text-red-500 w-8 h-8 flex items-center justify-center neo-btn rounded-md" onClick={() => deleteHabit(h.id)}>✕</button>
            </div>
          );
        })}
        {habits.length === 0 && <p className="text-muted text-sm text-center py-4">Привычек пока нет</p>}
      </div>
    </div>
  );
}
