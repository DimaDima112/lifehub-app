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
      topicId,
      title: title.trim(),
      description: desc.trim(),
      status: 'pending',
      photos: [],
      date: new Date().toISOString().slice(0, 10),
    });
    setTitle('');
    setDesc('');
  };

  const list = ideas.filter((i) => filter === 'all' || i.topicId === filter).filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4">Идеи</h1>

      {topics.length === 0 ? (
        <p className="text-gray-500">Сначала создайте тему в разделе «Темы».</p>
      ) : (
        <>
          <div className="space-y-2 mb-4 border rounded p-3 bg-gray-50">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Заголовок идеи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Описание"
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="flex-1 border rounded px-2 py-1"
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button className="bg-blue-600 text-white px-4 rounded" onClick={submit}>+</button>
            </div>
          </div>

          <input className="w-full border rounded px-3 py-1 text-sm mb-3" placeholder="🔍 Поиск идей..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex gap-1 flex-wrap mb-4 text-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >Все</button>
            {topics.map((t) => {
              const c = colorMap[t.color];
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`px-3 py-1 rounded border ${filter === t.id ? c.bg + ' ' + c.text + ' ' + c.border : 'bg-white'}`}
                >{t.name}</button>
              );
            })}
          </div>

          <div className="space-y-2">
            {list.map((i) => {
              const topic = topics.find((t) => t.id === i.topicId);
              return <IdeaCard key={i.id} idea={i} color={topic?.color ?? 'blue'} />;
            })}
            {list.length === 0 && <p className="text-gray-500 text-center py-6">Идей пока нет</p>}
          </div>
        </>
      )}
    </div>
  );
}
