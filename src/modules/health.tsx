import { useState } from 'react';
import { useStore } from '../store/appStore';
import HealthChart from '../components/HealthChart';

const today = () => new Date().toISOString().slice(0, 10);
const slotLabel: Record<'morning' | 'day' | 'evening', string> = {
  morning: '🌅 Утро',
  day: '☀️ День',
  evening: '🌙 Вечер',
};

export default function Health() {
  const { workouts, addWorkout, toggleWorkout, deleteWorkout } = useStore();
  const [plan, setPlan] = useState('');
  const [slot, setSlot] = useState<'morning' | 'day' | 'evening'>('morning');
  const [date, setDate] = useState(today());

  const submit = () => {
    if (!plan.trim()) return;
    addWorkout({ plan: plan.trim(), slot, date, done: false });
    setPlan('');
  };

  const dayList = workouts.filter((w) => w.date === date);
  const slots: ('morning' | 'day' | 'evening')[] = ['morning', 'day', 'evening'];

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Спорт</h1>

      <HealthChart workouts={workouts} />

      <h2 className="font-bold text-sm mb-2 text-main uppercase tracking-wide">План тренировок</h2>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input className="flex-1 min-w-[120px] neo-inset px-3 py-2 text-sm" placeholder="Упражнение"
          value={plan} onChange={(e) => setPlan(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <select className="neo-inset px-2 py-2 text-sm" value={slot}
          onChange={(e) => setSlot(e.target.value as typeof slot)}>
          <option value="morning">Утро</option>
          <option value="day">День</option>
          <option value="evening">Вечер</option>
        </select>
        <input className="neo-inset px-2 py-2 text-sm" type="date" value={date}
          onChange={(e) => setDate(e.target.value)} />
        <button className="neo-accent px-4 rounded-lg font-bold" onClick={submit}>+</button>
      </div>

      <div className="space-y-4">
        {slots.map((s) => {
          const items = dayList.filter((w) => w.slot === s);
          if (items.length === 0) return null;
          return (
            <div key={s}>
              <p className="font-bold text-xs text-muted uppercase tracking-wide mb-2">{slotLabel[s]}</p>
              {items.map((w) => (
                <div key={w.id} className="flex items-center gap-3 p-3 neo-raised mb-2">
                  <input type="checkbox" className="w-5 h-5 rounded accent-blue-600" checked={w.done}
                    onChange={() => toggleWorkout(w.id)} />
                  <div className="flex-1">
                    <span className={`block text-sm font-medium ${w.done ? 'line-through text-muted' : 'text-main'}`}>
                      {w.plan}
                    </span>
                    {(w.sets || w.reps) && (
                      <span className="text-xs text-muted">{w.sets} подх. × {w.reps} повт.</span>
                    )}
                  </div>
                  <button className="text-muted hover:text-red-500 w-8 h-8 flex items-center justify-center neo-btn rounded-md" onClick={() => deleteWorkout(w.id)}>✕</button>
                </div>
              ))}
            </div>
          );
        })}
        {dayList.length === 0 && <p className="text-muted text-sm text-center py-4">На этот день тренировок нет</p>}
      </div>
    </div>
  );
}
