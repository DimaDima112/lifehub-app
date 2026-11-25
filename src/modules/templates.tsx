import { useState } from 'react';
import { useStore } from '../store/appStore';
import type { TemplateItem } from '../store/types';

export default function Templates() {
  const { templates, topics, addTemplate, deleteTemplate, applyTemplate } = useStore();
  const [name, setName] = useState('');
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [itemTitle, setItemTitle] = useState('');

  const addItem = () => {
    if (!itemTitle.trim()) return;
    setItems([...items, { title: itemTitle.trim(), subtasks: [] }]);
    setItemTitle('');
  };

  const submit = () => {
    if (!name.trim() || items.length === 0) return;
    addTemplate({ name: name.trim(), topicId: topicId || undefined, items });
    setName(''); setItems([]);
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4">Шаблоны планов</h1>

      <div className="border rounded-lg p-3 mb-4 bg-gray-50 space-y-2">
        <input className="w-full border rounded px-3 py-2" placeholder="Название шаблона (например, «Утренняя рутина»)"
          value={name} onChange={(e) => setName(e.target.value)} />
        <select className="w-full border rounded px-2 py-1" value={topicId}
          onChange={(e) => setTopicId(e.target.value)}>
          {topics.length === 0 && <option value="">Сначала создайте тему</option>}
          {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-2 py-1" placeholder="Задача в шаблоне"
            value={itemTitle} onChange={(e) => setItemTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()} />
          <button className="bg-gray-600 text-white px-3 rounded" onClick={addItem}>+ задача</button>
        </div>
        {items.length > 0 && (
          <ul className="text-sm list-disc pl-5">
            {items.map((i, idx) => (
              <li key={idx} className="flex justify-between">
                {i.title}
                <button className="text-red-600 text-xs" onClick={() => setItems(items.filter((_, n) => n !== idx))}>✕</button>
              </li>
            ))}
          </ul>
        )}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={submit}
          disabled={!name.trim() || items.length === 0}>
          Сохранить шаблон
        </button>
      </div>

      <h2 className="font-semibold mb-2">Мои шаблоны ({templates.length})</h2>
      <div className="space-y-2">
        {templates.map((t) => (
          <div key={t.id} className="border rounded p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium flex-1">{t.name}</span>
              <span className="text-xs text-gray-500">{t.items.length} задач</span>
              <button className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                onClick={() => applyTemplate(t.id)}>Применить</button>
              <button className="text-red-600 text-xs" onClick={() => deleteTemplate(t.id)}>✕</button>
            </div>
            <ul className="text-sm text-gray-600 mt-1 list-disc pl-5">
              {t.items.map((i, idx) => <li key={idx}>{i.title}</li>)}
            </ul>
          </div>
        ))}
        {templates.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Шаблонов пока нет</p>}
      </div>
    </div>
  );
}
