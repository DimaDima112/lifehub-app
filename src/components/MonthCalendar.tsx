import type { Task, Habit } from '../store/types';

interface Props {
  year: number;
  month: number;          // 0–11
  tasks: Task[];
  habits: Habit[];
  onPickDay: (date: string) => void;
  selectedDate?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

export default function MonthCalendar({ year, month, tasks, habits, onPickDay, selectedDate }: Props) {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // понедельник = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const hasActivity = (date: string) => {
    const hasTask = tasks.some((t) => t.dueDate === date);
    const hasHabit = habits.some((h) => (h.logs[date] ?? 0) > 0);
    return { hasTask, hasHabit };
  };

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="bg-white border rounded-lg p-3">
      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
        {weekdays.map((w) => <div key={w} className="text-center">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const date = fmt(year, month, d);
          const act = hasActivity(date);
          const isSelected = selectedDate === date;
          const isToday = date === new Date().toISOString().slice(0, 10);
          return (
            <button
              key={i}
              onClick={() => onPickDay(date)}
              className={`relative aspect-square rounded text-sm flex flex-col items-center justify-center
                ${isSelected ? 'bg-blue-600 text-white' : isToday ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100'}`}
            >
              {d}
              <span className="flex gap-0.5 mt-0.5">
                {act.hasTask && <span className="w-1 h-1 rounded-full bg-orange-500 inline-block" />}
                {act.hasHabit && <span className="w-1 h-1 rounded-full bg-green-500 inline-block" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
