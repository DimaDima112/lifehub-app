import { useState } from 'react';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import type { ThemeColor } from '../store/types';

export default function Topics() {
  const { topics, tasks, addTopic, deleteTopic } = useStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState<ThemeColor>('blue');

  const submit = () => {
    if (!name.trim()) return;
    addTopic({ name: name.trim(), color });
    setName('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-main">Мои темы</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 neo-inset px-4 py-3 text-sm placeholder:text-[var(--text-muted)]"
          placeholder="Название темы (например, Авто)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <select
          className="neo-inset px-2 text-sm"
          value={color}
          onChange={(e) => setColor(e.target.value as ThemeColor)}
        >
          {Object.keys(colorMap).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="neo-primary px-4 font-bold text-lg" onClick={submit}>
          +
        </button>
      </div>

      <div className="space-y-3">
        {topics.map((t) => {
          const total = tasks.filter((x) => x.topicId === t.id);
          const done = total.filter((x) => x.done).length;
          const c = colorMap[t.color];
          return (
            <div key={t.id} className="flex items-center justify-between p-4 neo-raised">
              <a href={`#/topic/${t.id}`} className="font-semibold flex-1 min-w-0 pr-2 text-main flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: c.hex }} />
                <span className="truncate">{t.name}</span>
                <span className="ml-1 text-xs font-normal text-muted">({done}/{total.length})</span>
              </a>
              <button
                className="text-red-500 text-sm p-2 neo-button"
                onClick={() => confirm(`Удалить тему "${t.name}"?`) && deleteTopic(t.id)}
              >
                ✕
              </button>
            </div>
          );
        })}
        {topics.length === 0 && (
          <p className="text-muted text-center py-8 text-sm">Тем пока нет. Создайте первую.</p>
        )}
      </div>
    </div>
  );
}
