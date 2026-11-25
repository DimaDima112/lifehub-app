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
    addDate({
      title: title.trim(),
      date,
      phone: phone.trim() || undefined,
      note: note.trim() || undefined,
      reminderDays,
      recurring,
    });
    setTitle(''); setPhone(''); setNote('');
    setReminderDays(7); setRecurring('none');
  };

  const sorted = [...dates].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4">Полезные даты</h1>

      <div className="space-y-2 mb-4 border rounded p-3 bg-gray-50">
        <input className="w-full border rounded px-3 py-2" placeholder="Название (день рождения, оплата кредита…)"
          value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-2 py-1" type="date" value={date}
            onChange={(e) => setDate(e.target.value)} />
          <input className="flex-1 border rounded px-2 py-1" placeholder="Телефон (необяз.)"
            value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <input className="w-full border rounded px-3 py-2" placeholder="Пометка (необяз.)"
          value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="flex gap-2 items-center text-sm">
          <label className="flex items-center gap-1">
            Напомнить за
            <input type="number" min={0} max={365} className="border rounded px-2 py-1 w-16"
              value={reminderDays} onChange={(e) => setReminderDays(Number(e.target.value))} />
            дн.
          </label>
          <select className="border rounded px-2 py-1 ml-auto" value={recurring}
            onChange={(e) => setRecurring(e.target.value as ImportantDate['recurring'])}>
            <option value="none">Без повтора</option>
            <option value="monthly">Ежемесячно</option>
            <option value="yearly">Ежегодно</option>
          </select>
          <button className="bg-blue-600 text-white px-4 rounded" onClick={submit}>+</button>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && <p className="text-gray-500 text-sm text-center py-6">Дат пока нет</p>}
        {sorted.map((d) => (
          <div key={d.id} className="border rounded p-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-24">{d.date}</span>
              <span className="flex-1 font-medium">{d.title}</span>
              {d.recurring !== 'none' && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 rounded">
                  {d.recurring === 'yearly' ? 'ежегодно' : 'ежемесячно'}
                </span>
              )}
              <button className="text-red-600 text-xs" onClick={() => deleteDate(d.id)}>✕</button>
            </div>
            {(d.phone || d.note) && (
              <div className="mt-1 text-xs text-gray-600 flex gap-3 flex-wrap">
                {d.phone && <a href={`tel:${d.phone}`} className="text-blue-600">📞 {d.phone}</a>}
                {d.note && <span>📝 {d.note}</span>}
                <span className="ml-auto text-gray-400">напомнить за {d.reminderDays} дн.</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
