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
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4">Мои темы</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Название темы (например, Авто)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <select
          className="border rounded px-2"
          value={color}
          onChange={(e) => setColor(e.target.value as ThemeColor)}
        >
          {Object.keys(colorMap).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 rounded" onClick={submit}>
          +
        </button>
      </div>

      <div className="space-y-3">
        {topics.map((t) => {
          const total = tasks.filter((x) => x.topicId === t.id);
          const done = total.filter((x) => x.done).length;
          const c = colorMap[t.color];
          return (
            <div
              key={t.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${c.bg} ${c.border}`}
            >
              <a href={`#/topic/${t.id}`} className={`font-semibold ${c.text} flex-1`}>
                <span className="truncate block">{t.name}</span>
                <span className="ml-2 text-sm opacity-70">({done}/{total.length})</span>
              </a>
              <button
                className="text-red-600 text-sm"
                onClick={() => confirm(`Удалить тему "$<span className="truncate block">{t.name}</span>"?`) && deleteTopic(t.id)}
              >
                ✕
              </button>
            </div>
          );
        })}
        {topics.length === 0 && (
          <p className="text-gray-500 text-center py-8">Тем пока нет. Создайте первую.</p>
        )}
      </div>
    </div>
  );
}
