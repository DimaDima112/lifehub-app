import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';

const pad = (n: number) => String(n).padStart(2, '0');
const today = () => new Date().toISOString().slice(0, 10);
const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export default function Dashboard() {
  const { topics, tasks, toggleTask } = useStore();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  return (
    <div className="p-2 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-2 px-1">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 text-lg">←</button>
        <h1 className="text-base font-bold">{monthNames[month]} {year}</h1>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 text-lg">→</button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1 text-[10px] text-gray-500 text-center font-medium">
        {weekdays.map((w) => <div key={w}>{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-0.5 flex-1 auto-rows-fr overflow-hidden">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="bg-gray-50 dark:bg-slate-800/30 rounded-sm" />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
          const isToday = dateStr === today();
          const dayTasks = tasks.filter(t => t.dueDate === dateStr);

          return (
            <div key={i} onClick={() => setSelectedDate(dateStr)}
              className={`border rounded-sm p-0.5 flex flex-col overflow-hidden cursor-pointer
                ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
              <span className={`text-[10px] font-bold leading-none mb-0.5 ${isToday ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>{d}</span>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-[1px]">
                {dayTasks.slice(0, 4).map((t) => {
                  const topic = topics.find(tp => tp.id === t.topicId);
                  const color = topic ? colorMap[topic.color].hex : '#3b82f6';
                  return (
                    <div key={t.id} onClick={(e) => { e.stopPropagation(); toggleTask(t.id); }}
                      className={`text-[7px] leading-tight px-0.5 py-[1px] rounded-sm truncate ${t.done ? 'opacity-40 line-through' : ''}`}
                      style={{ backgroundColor: color + '30', color, borderLeft: `1.5px solid ${color}` }}>
                      {t.title}
                    </div>
                  );
                })}
                {dayTasks.length > 4 && <div className="text-[7px] text-gray-500">+{dayTasks.length - 4}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end justify-center" onClick={() => setSelectedDate(null)}>
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">{selectedDate}</h2>
              <button onClick={() => setSelectedDate(null)} className="text-gray-500 text-2xl leading-none">&times;</button>
            </div>
            {tasks.filter(t => t.dueDate === selectedDate).length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Нет задач</p>
            ) : (
              <div className="space-y-1.5">
                {tasks.filter(t => t.dueDate === selectedDate).map(t => {
                  const topic = topics.find(tp => tp.id === t.topicId);
                  return (
                    <div key={t.id} className="flex items-center gap-2 p-2 border rounded-lg dark:border-slate-600">
                      <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} className="w-5 h-5 shrink-0" />
                      <span className={`flex-1 text-sm ${t.done ? 'line-through opacity-60' : ''}`}>{t.title}</span>
                      {topic && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: colorMap[topic.color].hex + '30', color: colorMap[topic.color].hex }}>{topic.name}</span>}
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => { navigate(`/planner/${selectedDate}`); setSelectedDate(null); }}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-sm">
              Открыть планер
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
