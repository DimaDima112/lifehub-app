import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';

type Result = { type: string; title: string; sub?: string; path: string };

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { topics, tasks, ideas, finances, dates, habits } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  if (!open) return null;

  const query = q.trim().toLowerCase();
  const results: Result[] = [];
  if (query) {
    topics.filter((t) => t.name.toLowerCase().includes(query)).forEach((t) => results.push({ type: 'Тема', title: t.name, path: `/topic/${t.id}` }));
    tasks.filter((t) => t.title.toLowerCase().includes(query)).forEach((t) => {
      const topic = topics.find((x) => x.id === t.topicId);
      results.push({ type: 'Задача', title: t.title, sub: topic?.name, path: `/topic/${t.topicId}` });
    });
    ideas.filter((i) => i.title.toLowerCase().includes(query)).forEach((i) => results.push({ type: 'Идея', title: i.title, path: '/ideas' }));
    finances.filter((f) => f.source.toLowerCase().includes(query)).forEach((f) => results.push({ type: 'Финансы', title: f.source, sub: `${f.amount} ₽`, path: '/finance' }));
    dates.filter((d) => d.title.toLowerCase().includes(query)).forEach((d) => results.push({ type: 'Дата', title: d.title, sub: d.date, path: '/dates' }));
    habits.filter((h) => h.name.toLowerCase().includes(query)).forEach((h) => results.push({ type: 'Привычка', title: h.name, path: '/planner' }));
  }

  const go = (path: string) => { navigate(path); setOpen(false); setQ(''); };

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-start justify-center pt-16 px-3" onClick={() => setOpen(false)}>
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input ref={inputRef} className="w-full border-b dark:border-slate-600 px-4 py-3 text-base outline-none rounded-t-xl bg-transparent"
          placeholder="Поиск по всему..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="max-h-96 overflow-y-auto">
          {!query && <p className="p-4 text-sm text-gray-500">Начните вводить...</p>}
          {query && results.length === 0 && <p className="p-4 text-sm text-gray-500">Ничего не найдено</p>}
          {results.map((r, i) => (
            <button key={i} onClick={() => go(r.path)} className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 border-b dark:border-slate-700 last:border-b-0">
              <span className="text-[10px] bg-gray-200 dark:bg-slate-600 rounded px-1.5 py-0.5 mr-2">{r.type}</span>
              <span className="font-medium text-sm">{r.title}</span>
              {r.sub && <span className="text-xs text-gray-500 ml-2">{r.sub}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
