import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';
import MonthCalendar from '../components/MonthCalendar';

const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export default function YearPlan() {
  const { tasks, habits } = useStore();
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [openMonth, setOpenMonth] = useState<number | null>(now.getMonth());
  const [selected, setSelected] = useState<string | undefined>();

  const goDay = (date: string) => {
    setSelected(date);
    navigate(`/planner/${date}`);
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <button className="px-3 py-1 border rounded" onClick={() => setYear((y) => y - 1)}>←</button>
        <h1 className="text-2xl font-bold">{year}</h1>
        <button className="px-3 py-1 border rounded" onClick={() => setYear((y) => y + 1)}>→</button>
      </div>

      <div className="space-y-2">
        {monthNames.map((name, idx) => {
          const open = openMonth === idx;
          return (
            <div key={idx} className="border rounded-lg overflow-hidden">
              <button
                className={`w-full flex justify-between items-center px-4 py-2 ${open ? 'bg-blue-50' : 'bg-gray-50'}`}
                onClick={() => setOpenMonth(open ? null : idx)}
              >
                <span className="font-semibold">{name}</span>
                <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
              </button>
              {open && (
                <div className="p-2">
                  <MonthCalendar
                    year={year}
                    month={idx}
                    tasks={tasks}
                    habits={habits}
                    onPickDay={goDay}
                    selectedDate={selected}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1" />задачи
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 ml-3 mr-1" />привычки
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
