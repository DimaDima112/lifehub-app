import { Link } from 'react-router-dom';

const links = [
  { path: '/ideas', label: 'Идеи', icon: '💡' },
  { path: '/year', label: 'Год', icon: '🗓️' },
  { path: '/dates', label: 'Даты', icon: '📌' },
  { path: '/health', label: 'Спорт', icon: '💪' },
  { path: '/templates', label: 'Шаблоны', icon: '📋' },
  { path: '/settings', label: 'Настройки', icon: '⚙️' },
  { path: '/topics', label: 'Темы', icon: '📁' },
];

export default function More() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Ещё</h1>
      <div className="grid grid-cols-2 gap-3">
        {links.map((l) => (
          <Link key={l.path} to={l.path}
            className="border rounded-xl p-4 text-center active:bg-gray-100 dark:active:bg-slate-700">
            <span className="text-3xl block mb-1">{l.icon}</span>
            <span className="text-sm font-medium">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
