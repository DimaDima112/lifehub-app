import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import type { ThemeColor, Task, Workout } from '../store/types';
import HabitChart from '../components/HabitChart';

const today = () => new Date().toISOString().slice(0, 10);

export default function Planner() {
  const { date: urlDate } = useParams();
  const navigate = useNavigate();
  const date = urlDate ?? today();

  const { 
    topics, tasks, toggleTask, habits, addHabit, deleteHabit, logHabit, 
    workouts, toggleWorkout, updateTask, deleteTask 
  } = useStore();
  
  const [hName, setHName] = useState('');
  const [hColor, setHColor] = useState<ThemeColor>('blue');
  const [hCategory, setHCategory] = useState<'mind' | 'strength' | 'endurance' | 'other'>('mind');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // --- ЛОГИКА СБОРА ДАННЫХ ---
  // 1. Задачи на этот день
  const dayTasks = tasks.filter((t) => !t.dueDate || t.dueDate === date);
  // 2. Тренировки на этот день
  const dayWorkouts = workouts.filter((w) => w.date === date);

  // Объединяем в один список для отображения
  const combinedList = [
    ...dayTasks.map(t => ({ type: 'task' as const, item: t })),
    ...dayWorkouts.map(w => ({ type: 'workout' as const, item: w }))
  ];

  const activeTasks = combinedList.filter(x => !x.item.done);
  const doneToday = combinedList.filter(x => x.item.done).length;

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
      <div className="flex items-center justify-between mb-4">
        <button className="w-10 h-10 flex items-center justify-center neo-btn rounded-lg" onClick={() => shiftDay(-1)}>←</button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-main">Планер</h1>
          <p className="text-xs text-muted">{date}{date === today() ? ' (сегодня)' : ''}</p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center neo-btn rounded-lg" onClick={() => shiftDay(1)}>→</button>
      </div>

      <div className="flex justify-center mb-4">
        <button className="text-xs neo-btn px-3 py-1 text-muted" onClick={() => navigate('/planner')}>на сегодня</button>
      </div>

      <h2 className="font-bold text-sm mb-2 text-main uppercase tracking-wide">Привычки</h2>
      <HabitChart habits={habits} date={date} />

      <div className="space-y-2 mb-6">
        <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Новая привычка"
          value={hName} onChange={(e) => setHName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitHabit()} />
        <div className="flex gap-2">
          <select className="flex-1 neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" value={hCategory}
            onChange={(e) => setHCategory(e.target.value as typeof hCategory)}>
            <option value="mind">Ум</option>
            <option value="strength">Сила</option>
            <option value="endurance">Выносливость</option>
            <option value="other">Другое</option>
          </select>
          <select className="flex-1 neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" value={hColor}
            onChange={(e) => setHColor(e.target.value as ThemeColor)}>
            {Object.keys(colorMap).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="neo-accent px-4 rounded-lg text-lg" onClick={submitHabit}>+</button>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {habits.map((h) => {
          const c = colorMap[h.color];
          const count = h.logs[date] ?? 0;
          return (
            <div key={h.id} className="flex items-center gap-2 p-2 neo-raised">
              <span className="flex-1 font-medium text-sm" style={{ color: c.hex }}>{h.name}</span>
              <button className="w-8 h-8 neo-btn rounded-md flex items-center justify-center text-lg" onClick={() => logHabit(h.id, date, -1)}>−</button>
              <span className="w-6 text-center font-bold text-sm">{count}</span>
              <button className="w-8 h-8 neo-btn rounded-md flex items-center justify-center text-lg" onClick={() => logHabit(h.id, date, 1)}>+</button>
              <button className="text-muted hover:text-red-500 text-xs ml-1 w-6" onClick={() => deleteHabit(h.id)}>✕</button>
            </div>
          );
        })}
      </div>

      <h2 className="font-bold text-sm mb-2 text-main uppercase tracking-wide">Задачи и Тренировки ({doneToday}/{combinedList.length})</h2>
      <div className="space-y-2">
        {activeTasks.length === 0 && combinedList.length > 0 && <p className="text-green-600 text-sm text-center font-medium py-4">Все дела выполнены 🎉</p>}
        
        {activeTasks.map(({ type, item }) => {
          if (type === 'task') {
            const t = item as Task;
            const topic = topics.find((tp) => tp.id === t.topicId);
            const c = topic ? colorMap[topic.color] : colorMap.blue;
            return (
              <div key={t.id} className="flex items-center gap-3 p-3 neo-raised cursor-pointer" onClick={() => setSelectedTask(t)}>
                <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
                  <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" onChange={() => toggleTask(t.id)} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-main block truncate">{t.title}</span>
                  {t.subtasks.length > 0 && <span className="text-[10px] text-muted">{t.subtasks.filter(s=>s.done).length}/{t.subtasks.length} подзадач</span>}
                </div>
                {topic && <span className="text-[10px] font-bold px-2 py-1 rounded-md text-white shadow-sm shrink-0" style={{ backgroundColor: c.hex }}>{topic.name}</span>}
              </div>
            );
          } else {
            const w = item as Workout;
            return (
              <div key={w.id} className="flex items-center gap-3 p-3 neo-raised border-l-4 border-l-orange-500">
                <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
                  <input type="checkbox" className="w-5 h-5 rounded accent-orange-500 cursor-pointer" onChange={() => toggleWorkout(w.id)} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-main block truncate">{w.plan}</span>
                  {(w.sets || w.reps) && <span className="text-[10px] text-muted">{w.sets} подх. × {w.reps} повт.</span>}
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-orange-100 text-orange-700 shrink-0">💪 Спорт</span>
              </div>
            );
          }
        })}
        {combinedList.length === 0 && <p className="text-muted text-sm text-center py-4">Задач и тренировок на этот день нет</p>}
      </div>

      {/* Модалка задачи (без изменений) */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end justify-center" onClick={() => setSelectedTask(null)}>
          <div className="neo-raised w-full max-w-md rounded-t-2xl p-5 max-h-[85vh] flex flex-col rounded-b-none border-b-0" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-main">{selectedTask.title}</h2>
                <p className="text-xs text-muted mt-1">Создано: {selectedTask.dueDate || 'без даты'}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="neo-btn w-8 h-8 rounded-full flex items-center justify-center text-muted">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="flex gap-2">
                <button className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedTask.done ? 'neo-btn text-green-600' : 'neo-primary'}`} onClick={() => { toggleTask(selectedTask.id); setSelectedTask(null); }}>
                  {selectedTask.done ? 'Вернуть в работу' : 'Отметить выполненной'}
                </button>
                <button className="neo-btn px-4 text-red-500 rounded-lg text-sm" onClick={() => { deleteTask(selectedTask.id); setSelectedTask(null); }}>Удалить</button>
              </div>
              {selectedTask.subtasks.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted uppercase mb-2">Подзадачи</p>
                  <div className="space-y-1">
                    {selectedTask.subtasks.map(st => (
                      <div key={st.id} className="flex items-center gap-2 p-2 neo-inset rounded-md">
                        <input type="checkbox" checked={st.done} onChange={() => {
                          const updated = selectedTask.subtasks.map(s => s.id === st.id ? { ...s, done: !s.done } : s);
                          updateTask(selectedTask.id, { subtasks: updated });
                          setSelectedTask({ ...selectedTask, subtasks: updated });
                        }} className="w-4 h-4 rounded accent-blue-600" />
                        <span className={`text-sm ${st.done ? 'line-through text-muted' : 'text-main'}`}>{st.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedTask.notes && (
                <div>
                  <p className="text-xs font-bold text-muted uppercase mb-2">Пометки</p>
                  <p className="text-sm text-main whitespace-pre-wrap neo-inset p-3">{selectedTask.notes}</p>
                </div>
              )}
              {selectedTask.attachments.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted uppercase mb-2">Фотографии</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedTask.attachments.map(a => a.url && <img key={a.id} src={a.url} className="w-20 h-20 object-cover rounded-lg shadow-sm" />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
