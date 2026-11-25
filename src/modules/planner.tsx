import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import type { ThemeColor } from '../store/types';
import HabitChart from '../components/HabitChart';

const today = () => new Date().toISOString().slice(0, 10);

export default function Planner() {
  const { date: urlDate } = useParams();
  const navigate = useNavigate();
  const date = urlDate ?? today();

  const { topics, tasks, toggleTask, habits, addHabit, deleteHabit, logHabit } = useStore();
  const [hName, setHName] = useState('');
  const [hColor, setHColor] = useState<ThemeColor>('blue');
  const [hCategory, setHCategory] = useState<'mind' | 'strength' | 'endurance' | 'other'>('mind');

  const dayTasks = tasks.filter((t) => !t.dueDate || t.dueDate === date);
  const activeTasks = dayTasks.filter((t) => !t.done);
  const doneToday = dayTasks.filter((t) => t.done).length;

  const shiftDay = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    navigate(`/planner/${d.toISOString().slice(0, 10)}`);
  };

  const submitHabit = () => {
    if (!hName.trim()) return;
    addHabit({ name: hName.trim(), category: hCategory, color: hColor, dailyTarget: 1, logs: {} });
    setHName('');
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <button className="px-3 py-2 border rounded-lg text-sm" onClick={() => shiftDay(-1)}>←</button>
        <div className="text-center">
          <h1 className="text-lg font-bold">Планер</h1>
          <p className="text-xs text-gray-500">{date}{date === today() ? ' (сегодня)' : ''}</p>
        </div>
        <button className="px-3 py-2 border rounded-lg text-sm" onClick={() => shiftDay(1)}>→</button>
      </div>

      <div className="flex justify-center mb-3">
        <button className="text-xs text-blue-600" onClick={() => navigate('/planner')}>на сегодня</button>
      </div>

      <h2 className="font-semibold text-sm mb-2">Привычки</h2>
      <HabitChart habits={habits} date={date} />

      <div className="space-y-2 mb-4">
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Новая привычка"
          value={hName} onChange={(e) => setHName(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter') && submitHabit()} />
        <div className="flex gap-2">
          <select className="flex-1 border rounded-lg px-2 py-2 text-sm" value={hCategory}
            onChange={(e) => setHCategory(e.target.value as typeof hCategory)}>
            <option value="mind">Ум</option>
            <option value="strength">Сила</option>
            <option value="endurance">Выносливость</option>
            <option value="other">Другое</option>
          </select>
          <select className="flex-1 border rounded-lg px-2 py-2 text-sm" value={hColor}
            onChange={(e) => setHColor(e.target.value as ThemeColor)}>
            {Object.keys(colorMap).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="bg-blue-600 text-white px-4 rounded-lg" onClick={submitHabit}>+</button>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        {habits.map((h) => {
          const c = colorMap[h.color];
          const count = h.logs[date] ?? 0;
          return (
            <div key={h.id} className={`flex items-center gap-2 p-2 rounded-lg border ${c.bg} ${c.border}`}>
              <span className={`flex-1 font-medium text-sm ${c.text}`}>{h.name}</span>
              <button className="bg-white dark:bg-slate-700 border rounded-md w-8 h-8 text-sm" onClick={() => logHabit(h.id, date, -1)}>−</button>
              <span className="w-6 text-center font-bold text-sm">{count}</span>
              <button className="bg-white dark:bg-slate-700 border rounded-md w-8 h-8 text-sm" onClick={() => logHabit(h.id, date, 1)}>+</button>
              <button className="text-red-600 text-xs ml-1 w-6" onClick={() => deleteHabit(h.id)}>✕</button>
            </div>
          );
        })}
      </div>

      <h2 className="font-semibold text-sm mb-2">Задачи ({doneToday}/{dayTasks.length})</h2>
      <div className="space-y-1.5">
        {activeTasks.length === 0 && dayTasks.length > 0 && <p className="text-green-600 text-sm text-center">Все задачи выполнены 🎉</p>}
        {activeTasks.map((t) => {
          const topic = topics.find((tp) => tp.id === t.topicId);
          const c = topic ? colorMap[topic.color] : colorMap.blue;
          return (
            <label key={t.id} className={`flex items-center gap-2 p-2.5 rounded-lg border ${c.bg} ${c.border}`}>
              <input type="checkbox" className="w-5 h-5 shrink-0" onChange={() => toggleTask(t.id)} />
              <span className="flex-1 text-sm">{t.title}</span>
              {t.recurrence && t.recurrence !== 'none' && <span className="text-xs">🔄</span>}
              {topic && <span className={`text-[10px] ${c.text}`}>{topic.name}</span>}
            </label>
          );
        })}
        {dayTasks.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Задач на этот день нет</p>}
      </div>
    </div>
  );
}
