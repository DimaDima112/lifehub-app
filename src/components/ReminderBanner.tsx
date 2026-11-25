import { useStore } from '../store/appStore';
import type { ImportantDate } from '../store/types';


function daysUntil(dateStr: string, recurring?: ImportantDate['recurring']): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  if (recurring === 'yearly') {
    target.setFullYear(today.getFullYear());
    if (target < today) target.setFullYear(today.getFullYear() + 1);
  } else if (recurring === 'monthly') {
    target.setFullYear(today.getFullYear(), today.getMonth(), target.getDate());
    if (target < today) target.setMonth(today.getMonth() + 1);
  }

  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ReminderBanner() {
  const { dates } = useStore();
  const upcoming = dates
    .map((d) => ({ ...d, days: daysUntil(d.date, d.recurring) }))
    .filter((d) => d.days <= d.reminderDays && d.days >= 0)
    .sort((a, b) => a.days - b.days);

  if (upcoming.length === 0) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-400 px-3 py-2 text-sm">
      {upcoming.slice(0, 3).map((d) => (
        <div key={d.id} className="flex items-center gap-2">
          <span>🔔</span>
          <span className="font-medium">{d.title}</span>
          <span className="text-gray-600">
            — {d.days === 0 ? 'сегодня' : `через ${d.days} дн.`}
          </span>
          {d.phone && (
            <a href={`tel:${d.phone}`} className="text-blue-600 text-xs ml-auto">📞 {d.phone}</a>
          )}
        </div>
      ))}
    </div>
  );
}
