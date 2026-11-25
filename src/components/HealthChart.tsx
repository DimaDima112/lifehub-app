import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Workout } from '../store/types';

const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  workouts: Workout[];
}

export default function HealthChart({ workouts }: Props) {
  const today = new Date();
  const weeks: { label: string; done: number; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(today);
    start.setDate(today.getDate() - i * 7 - today.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const sKey = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
    const eKey = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
    const inWeek = workouts.filter((w) => w.date >= sKey && w.date <= eKey);
    weeks.push({
      label: `${pad(start.getDate())}.${pad(start.getMonth() + 1)}`,
      done: inWeek.filter((w) => w.done).length,
      total: inWeek.length,
    });
  }

  return (
    <div className="bg-white border rounded-lg p-3 mb-4" style={{ height: 200 }}>
      <p className="text-sm font-semibold mb-1">Тренировки по неделям</p>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={weeks}>
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="done" name="Сделано" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="total" name="План" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
