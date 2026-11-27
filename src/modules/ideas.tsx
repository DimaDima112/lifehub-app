import { useState } from 'react';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import IdeaCard from '../components/IdeaCard';

export default function Ideas() {
  const { topics, ideas, addIdea } = useStore();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const submit = () => {
    if (!title.trim() || !topicId) return;
    addIdea({
      topicId, title: title.trim(), description: desc.trim(),
      status: 'pending', photos: [], date: new Date().toISOString().slice(0, 10),
    });
    setTitle(''); setDesc('');
  };

  const list = ideas
    .filter((i) => filter === 'all' || i.topicId === filter)
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Идеи</h1>

      {topics.length === 0 ? (
        <p className="text-muted text-sm text-center py-4">Сначала создайте тему.</p>
      ) : (
        <>
          <div className="neo-inset p-4 mb-5 space-y-3">
            <p className="text-sm font-bold text-main uppercase tracking-wide">Новая идея</p>
            <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Описание" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className="flex gap-2">
              <select className="flex-1 neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button className="neo-accent px-5 rounded-lg text-lg" onClick={submit}>+</button>
            </div>
          </div>

          <input className="w-full neo-inset px-4 py-3 text-sm mb-3" placeholder="🔍 Поиск идей..." value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${filter === 'all' ? 'neo-primary' : 'neo-btn'}`}>Все</button>
            {topics.map((t) => (
              <button key={t.id} onClick={() => setFilter(t.id)} className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${filter === t.id ? 'neo-primary' : 'neo-btn'}`}>
                {t.name}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {list.map((i) => {
              const topic = topics.find((t) => t.id === i.topicId);
              return <IdeaCard key={i.id} idea={i} color={topic?.color ?? 'blue'} />;
            })}
            {list.length === 0 && <p className="text-muted text-sm text-center py-6">Идей пока нет</p>}
          </div>
        </>
      )}
    </div>
  );
}
