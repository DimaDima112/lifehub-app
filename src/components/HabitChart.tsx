import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Habit } from '../store/types';
import { colorMap } from '../utils/colors';

interface Props {
  habits: Habit[];
  date: string;
}

export default function HabitChart({ habits, date }: Props) {
  const data = habits.map((h) => ({
    name: h.name,
    value: h.logs[date] ?? 0,
    color: colorMap[h.color].hex,
  }));

  if (data.length === 0) {
    return <p className="text-gray-500 text-sm py-4 text-center">Добавьте привычку — появится график</p>;
  }

  return (
    <div className="bg-white border rounded-lg p-3 mb-4" style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
