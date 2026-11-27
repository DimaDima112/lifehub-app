import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';

const pad = (n: number) => String(n).padStart(2, '0');
const today = () => new Date().toISOString().slice(0, 10);
const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export default function Dashboard() {
  const { topics, tasks } = useStore();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

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
    <div className="p-3 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-8 h-8 flex items-center justify-center neo-btn rounded-lg">←</button>
        <h1 className="text-sm font-bold uppercase tracking-wider text-muted">{monthNames[month]} {year}</h1>
        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-8 h-8 flex items-center justify-center neo-btn rounded-lg">→</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1 text-[10px] text-muted text-center font-bold">
        {weekdays.map((w) => <div key={w}>{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr overflow-hidden">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="rounded-lg bg-black/5 dark:bg-white/5" />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
          const isToday = dateStr === today();
          const dayTasks = tasks.filter(t => t.dueDate === dateStr);

          return (
            // Клик по дню сразу открывает планер на эту дату
            <div key={i} onClick={() => navigate(`/planner/${dateStr}`)}
              className={`neo-inset p-1 flex flex-col overflow-hidden cursor-pointer ${isToday ? 'ring-1 ring-blue-500 border-blue-500' : ''}`}>
              <span className={`text-[10px] font-bold leading-none mb-1 ${isToday ? 'text-blue-600' : 'text-muted'}`}>{d}</span>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {dayTasks.slice(0, 4).map((t) => {
                  const topic = topics.find(tp => tp.id === t.topicId);
                  const color = topic ? colorMap[topic.color].hex : '#3b82f6';
                  return (
                    <div key={t.id}
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
    </div>
  );
}
