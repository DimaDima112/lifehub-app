import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { FinanceEntry } from '../store/types';

const pad = (n: number) => String(n).padStart(2, '0');
const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#eab308', '#14b8a6'];

interface Props { entries: FinanceEntry[]; year: number; }

export default function FinanceChart({ entries, year }: Props) {
  const monthly = Array.from({ length: 12 }, (_, m) => {
    const key = `${year}-${pad(m + 1)}`;
    const income = entries.filter((e) => e.type === 'income' && e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0);
    const expense = entries.filter((e) => e.type === 'expense' && e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0);
    return { month: pad(m + 1), income, expense };
  });

  const bySource: Record<string, number> = {};
  entries.filter((e) => e.type === 'income' && e.date.startsWith(String(year)))
    .forEach((e) => { bySource[e.source] = (bySource[e.source] ?? 0) + e.amount; });
  const pieData = Object.entries(bySource).map(([name, value]) => ({ name, value }));

  if (entries.length === 0) return <p className="text-gray-500 text-xs text-center py-3">Добавьте запись — появятся графики</p>;

  return (
    <div className="space-y-3 mb-3">
      <div className="bg-white dark:bg-slate-800 border rounded-lg p-2" style={{ height: 200 }}>
        <p className="text-xs font-semibold mb-1">По месяцам</p>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="income" name="Доход" fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expense" name="Расход" fill="#ef4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {pieData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border rounded-lg p-2" style={{ height: 200 }}>
          <p className="text-xs font-semibold mb-1">Источники дохода</p>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60} label={{ fontSize: 9 }}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
