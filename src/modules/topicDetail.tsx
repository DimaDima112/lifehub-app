import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import TaskCard from '../components/TaskCard';
import type { Task } from '../store/types';

type SortMode = 'default' | 'date-asc' | 'date-desc' | 'priority';
const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 } as const;

export default function TopicDetail() {
  const { id } = useParams();
  const { topics, tasks, addTask } = useStore();
  const topic = topics.find((t) => t.id === id);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<'active' | 'done' | 'all' | 'archive'>('active');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('default');

  if (!topic) return <p className="p-4">Тема не найдена</p>;

  const c = colorMap[topic.color];

  const sortFn = (a: Task, b: Task) => {
    if (sort === 'date-asc') return (a.dueDate ?? 'zzz').localeCompare(b.dueDate ?? 'zzz');
    if (sort === 'date-desc') return (b.dueDate ?? '').localeCompare(a.dueDate ?? '');
    if (sort === 'priority') return priorityOrder[a.priority ?? 'undefined'] - priorityOrder[b.priority ?? 'undefined'];
    return 0;
  };

  const list = tasks
    .filter((t) => t.topicId === topic.id)
    .filter((t) => {
      if (filter === 'active') return !t.done;
      if (filter === 'done') return t.done;
      if (filter === 'archive') return t.done;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort(sortFn);

  const submit = () => {
    if (!title.trim()) return;
    addTask({ topicId: topic.id, title: title.trim(), done: false, subtasks: [], attachments: [] });
    setTitle('');
  };

  return (
    <div className="p-3">
      <div className="text-sm mb-2"><a href="#/" className="text-blue-600">Главная</a> <span className="text-gray-400">/</span> <a href="#/topics" className="text-blue-600">Темы</a> <span className="text-gray-400">/</span> <span className="text-gray-700">{topic.name}</span></div>
      <h1 className={`text-2xl font-bold mt-2 mb-4 ${c.text}`}>{topic.name}</h1>

      <div className="flex gap-2 mb-3">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Новая задача..."
          value={title} onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <button className="bg-blue-600 text-white px-4 rounded" onClick={submit}>+</button>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <input className="flex-1 min-w-[160px] border rounded px-3 py-1 text-sm" placeholder="🔍 Поиск задач..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border rounded px-2 py-1 text-sm" value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}>
          <option value="default">Сортировка</option>
          <option value="date-asc">Дата ↑</option>
          <option value="date-desc">Дата ↓</option>
          <option value="priority">Приоритет</option>
        </select>
      </div>

      <div className="flex gap-2 mb-4 text-sm">
        {(['active', 'done', 'all', 'archive'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${filter === f ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
            {f === 'active' ? 'Активные' : f === 'done' ? 'Выполненные' : f === 'all' ? 'Все' : 'Архив'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((t) => <TaskCard key={t.id} task={t} color={topic.color} />)}
        {list.length === 0 && <p className="text-gray-500 text-center py-6">Ничего не найдено</p>}
      </div>
    </div>
  );
}
