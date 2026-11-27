import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';

const pad = (n: number) => String(n).padStart(2, '0');
const today = () => new Date().toISOString().slice(0, 10);
const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export default function Dashboard() {
  const { topics, tasks, toggleTask, addQuickTask } = useStore();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopicId, setNewTopicId] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const handleAddTask = () => {
    if (!newTitle.trim() || !newTopicId || !selectedDate) return;
    addQuickTask(newTopicId, newTitle.trim(), selectedDate);
    setNewTitle(''); setShowAdd(false);
  };

  return (
    <div className="p-3 h-[calc(100vh-4rem)] flex flex-col">
      {/* Шапка */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-8 h-8 flex items-center justify-center neo-btn rounded-lg">←</button>
        <h1 className="text-sm font-bold uppercase tracking-wider text-muted">{monthNames[month]} {year}</h1>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-8 h-8 flex items-center justify-center neo-btn rounded-lg">→</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1 text-[10px] text-muted text-center font-bold">
        {weekdays.map((w) => <div key={w}>{w}</div>)}
      </div>

      {/* Сетка */}
      <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr overflow-hidden">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="rounded-lg bg-black/5 dark:bg-white/5" />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
          const isToday = dateStr === today();
          const dayTasks = tasks.filter(t => t.dueDate === dateStr);

          return (
            <div key={i} onClick={() => { setSelectedDate(dateStr); setShowAdd(false); }}
              className={`neo-inset p-1 flex flex-col overflow-hidden cursor-pointer ${isToday ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}>
              <span className={`text-[10px] font-bold leading-none mb-1 ${isToday ? 'text-blue-600' : 'text-muted'}`}>{d}</span>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {dayTasks.slice(0, 4).map((t) => {
                  const topic = topics.find(tp => tp.id === t.topicId);
                  const color = topic ? colorMap[topic.color].hex : '#3b82f6';
                  return (
                    <div key={t.id} onClick={(e) => { e.stopPropagation(); toggleTask(t.id); }}
                      className={`text-[7px] leading-tight px-1 py-0.5 rounded-sm truncate shadow-sm ${t.done ? 'opacity-40 line-through' : ''}`}
                      style={{ backgroundColor: color, color: '#fff' }}>
                      {t.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно дня */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end justify-center" onClick={() => setSelectedDate(null)}>
          <div className="neo-raised w-full max-w-md rounded-t-2xl p-5 max-h-[85vh] flex flex-col rounded-b-none border-b-0" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{selectedDate}</h2>
              <button onClick={() => setSelectedDate(null)} className="neo-btn w-8 h-8 rounded-full flex items-center justify-center text-muted">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4">
              {tasks.filter(t => t.dueDate === selectedDate).length === 0 && !showAdd ? (
                <p className="text-muted text-sm text-center py-6">Задач на этот день нет</p>
              ) : (
                <div className="space-y-2">
                  {tasks.filter(t => t.dueDate === selectedDate).map(t => {
                    const topic = topics.find(tp => tp.id === t.topicId);
                    return (
                      <div key={t.id} className="flex items-center gap-3 p-3 neo-raised">
                        <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} className="w-5 h-5 rounded accent-blue-600" />
                        <span className={`flex-1 text-sm font-medium ${t.done ? 'line-through text-muted' : ''}`}>{t.title}</span>
                        {topic && <span className="text-[10px] font-bold px-2 py-1 rounded-md text-white shadow-sm" style={{ backgroundColor: colorMap[topic.color].hex }}>{topic.name}</span>}
                      </div>
                    );
                  })}
                </div>
              )}

              {showAdd && (
                <div className="mt-3 p-4 neo-inset space-y-3">
                  <input autoFocus className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Название задачи..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                  <select className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" value={newTopicId} onChange={(e) => setNewTopicId(e.target.value)}>
                    <option value="">Выберите тему...</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <button className="flex-1 neo-accent py-2 text-sm" onClick={handleAddTask}>Добавить</button>
                    <button className="px-4 neo-btn text-sm" onClick={() => setShowAdd(false)}>Отмена</button>
                  </div>
                </div>
              )}
            </div>

            {!showAdd && (
              <div className="space-y-2 mt-auto">
                <button onClick={() => setShowAdd(true)} className="w-full neo-primary py-3 text-sm flex items-center justify-center gap-2">
                  <span className="text-lg leading-none">+</span> Новая задача
                </button>
                <button onClick={() => { navigate(`/planner/${selectedDate}`); setSelectedDate(null); }} className="w-full neo-btn py-3 text-sm">
                  Открыть планер
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
