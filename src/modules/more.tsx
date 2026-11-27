import { Link } from 'react-router-dom';

const links = [
  { path: '/habits', label: 'Привычки', icon: '🔥' },
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
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Ещё</h1>
      <div className="grid grid-cols-2 gap-3">
        {links.map((l) => (
          <Link key={l.path} to={l.path} className="neo-raised p-4 text-center active:scale-95 transition-transform flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">{l.icon}</span>
            <span className="text-sm font-bold text-main">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
