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
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4">Спорт</h1>

      <HealthChart workouts={workouts} />


      <h2 className="font-semibold mb-2">План тренировок</h2>
      <div className="flex gap-2 mb-3 flex-wrap">
        <input className="flex-1 min-w-[120px] border rounded px-2 py-1" placeholder="Упражнение / план"
          value={plan} onChange={(e) => setPlan(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <select className="border rounded px-2" value={slot}
          onChange={(e) => setSlot(e.target.value as typeof slot)}>
          <option value="morning">Утро</option>
          <option value="day">День</option>
          <option value="evening">Вечер</option>
        </select>
        <input className="border rounded px-2" type="date" value={date}
          onChange={(e) => setDate(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 rounded" onClick={submit}>+</button>
      </div>

      <div className="space-y-3">
        {slots.map((s) => {
          const items = dayList.filter((w) => w.slot === s);
          if (items.length === 0) return null;
          return (
            <div key={s}>
              <p className="font-semibold text-sm mb-1">{slotLabel[s]}</p>
              {items.map((w) => (
                <div key={w.id} className="flex items-center gap-2 p-2 border rounded mb-1">
                  <input type="checkbox" className="w-5 h-5" checked={w.done}
                    onChange={() => toggleWorkout(w.id)} />
                  <span className={`flex-1 ${w.done ? 'line-through opacity-60' : ''}`}>{w.plan}</span>
                  <button className="text-red-600 text-xs" onClick={() => deleteWorkout(w.id)}>✕</button>
                </div>
              ))}
            </div>
          );
        })}
        {dayList.length === 0 && <p className="text-gray-500 text-sm">На этот день тренировок нет</p>}
      </div>
    </div>
  );
}
