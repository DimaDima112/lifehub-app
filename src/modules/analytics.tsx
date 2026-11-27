import { useStore } from '../store/appStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const { tasks, habits, moods } = useStore();

  // Подсчет выполненных задач за последние 7 дней
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

  const chartData = last7Days.map(date => {
    const done = tasks.filter(t => t.done && t.dueDate === date).length;
    const total = tasks.filter(t => t.dueDate === date).length;
    return { date: date.slice(5), done, total, mood: moods[date] || null };
  });

  const totalDone = tasks.filter(t => t.done).length;
  const totalHabitsToday = habits.reduce((acc, h) => acc + (h.logs[new Date().toISOString().slice(0, 10)] ?? 0), 0);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Аналитика</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="neo-raised p-4 text-center">
          <p className="text-xs text-muted font-bold uppercase">Всего задач</p>
          <p className="text-2xl font-bold text-main mt-1">{totalDone}</p>
        </div>
        <div className="neo-raised p-4 text-center">
          <p className="text-xs text-muted font-bold uppercase">Привычек сегодня</p>
          <p className="text-2xl font-bold text-main mt-1">{totalHabitsToday}</p>
        </div>
      </div>

      <div className="neo-raised p-4 mb-6" style={{ height: 260 }}>
        <p className="text-sm font-bold text-main mb-2">Задачи за неделю</p>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="done" name="Выполнено" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="total" name="Всего" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
