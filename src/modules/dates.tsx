import { useState } from 'react';
import { useStore } from '../store/appStore';
import type { ImportantDate } from '../store/types';

const today = () => new Date().toISOString().slice(0, 10);

export default function Dates() {
  const { dates, addDate, deleteDate } = useStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [reminderDays, setReminderDays] = useState(7);
  const [recurring, setRecurring] = useState<ImportantDate['recurring']>('none');

  const submit = () => {
    if (!title.trim() || !date) return;
    addDate({ title: title.trim(), date, phone: phone.trim() || undefined, note: note.trim() || undefined, reminderDays, recurring });
    setTitle(''); setPhone(''); setNote(''); setReminderDays(7); setRecurring('none');
  };

  const sorted = [...dates].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Полезные даты</h1>

      <div className="neo-inset p-4 mb-6 space-y-3">
        <p className="text-sm font-bold text-main uppercase tracking-wide">Добавить дату</p>
        <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex gap-2">
          <input className="flex-1 neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="flex-1 neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Пометка" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="flex gap-2 items-center text-sm">
          <label className="flex items-center gap-1 text-muted">
            Напомнить за
            <input type="number" min={0} max={365} className="neo-inset px-2 py-1 w-12 text-center bg-white dark:bg-slate-800" value={reminderDays} onChange={(e) => setReminderDays(Number(e.target.value))} />
          </label>
          <select className="flex-1 neo-inset px-2 py-1 bg-white dark:bg-slate-800" value={recurring} onChange={(e) => setRecurring(e.target.value as ImportantDate['recurring'])}>
            <option value="none">Один раз</option>
            <option value="monthly">Ежемесячно</option>
            <option value="yearly">Ежегодно</option>
          </select>
          <button className="neo-accent px-4 py-1.5 rounded-lg font-bold" onClick={submit}>+</button>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && <p className="text-muted text-sm text-center py-4">Дат пока нет</p>}
        {sorted.map((d) => (
          <div key={d.id} className="neo-raised p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted w-16">{d.date}</span>
              <span className="flex-1 font-bold text-main truncate">{d.title}</span>
              {d.recurring !== 'none' && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{d.recurring === 'yearly' ? 'год' : 'мес'}</span>}
              <button className="text-muted hover:text-red-500 w-7 h-7 flex items-center justify-center neo-btn" onClick={() => deleteDate(d.id)}>✕</button>
            </div>
            {(d.phone || d.note) && (
              <div className="mt-2 text-xs text-muted flex gap-3 flex-wrap pl-18">
                {d.phone && <a href={`tel:${d.phone}`} className="text-blue-600 font-medium">📞 {d.phone}</a>}
                {d.note && <span>📝 {d.note}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
