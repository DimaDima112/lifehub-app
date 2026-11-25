import { useState } from 'react';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import type { Task, ThemeColor } from '../store/types';

const priorityStyle: Record<NonNullable<Task['priority']>, { label: string; cls: string }> = {
  high:   { label: '🔴 Высокий', cls: 'bg-red-600 text-white' },
  medium: { label: '🟡 Средний', cls: 'bg-yellow-500 text-white' },
  low:    { label: '🟢 Низкий',  cls: 'bg-green-600 text-white' },
};

export default function TaskCard({ task, color }: { task: Task; color: ThemeColor }) {
  const {
    toggleTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask,
    addAttachment, deleteAttachment, updateTask,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState('');
  const [note, setNote] = useState(task.notes ?? '');
  const [editingNote, setEditingNote] = useState(false);
  const c = colorMap[color];
  const doneSubs = task.subtasks.filter((s) => s.done).length;

  const fileToBase64 = (file: File) =>
    new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(file);
    });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    addAttachment(task.id, { type: 'photo', url: await fileToBase64(f) });
    e.target.value = '';
  };

  return (
    <div className={`border rounded-lg p-3 ${c.bg} ${c.border}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="w-5 h-5" />
        {task.priority && (
          <span className={`text-xs px-1.5 rounded ${priorityStyle[task.priority].cls}`}>
            {priorityStyle[task.priority].label}
          </span>
        )}
        <span className={`flex-1 cursor-pointer ${task.done ? 'line-through opacity-60' : ''}`}
          onClick={() => setOpen((v) => !v)}>
          {task.title}
          {task.subtasks.length > 0 && <span className="ml-2 text-xs opacity-70">({doneSubs}/{task.subtasks.length})</span>}
          {task.dueDate && <span className="ml-2 text-xs bg-white/60 px-1 rounded">📅 {task.dueDate}</span>}
          {task.recurrence && task.recurrence !== 'none' && (
            <span className="ml-1 text-xs bg-white/60 px-1 rounded">
              🔄 {task.recurrence === 'daily' ? 'день' : task.recurrence === 'weekly' ? 'нед.' : 'мес.'}
            </span>
          )}
        </span>
        <button className="text-red-600 text-sm" onClick={() => deleteTask(task.id)}>✕</button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 text-sm">
          <div className="flex gap-2 flex-wrap">
            <label className="flex items-center gap-1">
              📅 <input type="date" className="border rounded px-2 py-1" value={task.dueDate ?? ''}
                onChange={(e) => updateTask(task.id, { dueDate: e.target.value || undefined })} />
            </label>
            <select className="border rounded px-2 py-1" value={task.recurrence ?? 'none'}
              onChange={(e) => updateTask(task.id, { recurrence: e.target.value as Task['recurrence'] })}>
              <option value="none">Без повтора</option>
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
              <option value="monthly">Ежемесячно</option>
            </select>
            <select className="border rounded px-2 py-1" value={task.priority ?? ''}
              onChange={(e) => updateTask(task.id, { priority: (e.target.value || undefined) as Task['priority'] })}>
              <option value="">Приоритет —</option>
              <option value="high">🔴 Высокий</option>
              <option value="medium">🟡 Средний</option>
              <option value="low">🟢 Низкий</option>
            </select>
          </div>

          <div>
            <p className="font-semibold mb-1">Подзадачи</p>
            {task.subtasks.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(task.id, s.id)} />
                <span className={s.done ? 'line-through opacity-60' : ''}>{s.title}</span>
                <button className="text-red-500 text-xs ml-auto" onClick={() => deleteSubtask(task.id, s.id)}>✕</button>
              </div>
            ))}
            <input className="w-full border rounded px-2 py-1 mt-1" placeholder="+ подзадача"
              value={sub} onChange={(e) => setSub(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && sub.trim()) { addSubtask(task.id, sub.trim()); setSub(''); } }} />
          </div>

          <div>
            <p className="font-semibold mb-1">Пометки</p>
            {editingNote ? (
              <div className="flex gap-1">
                <textarea className="flex-1 border rounded px-2 py-1" value={note}
                  onChange={(e) => setNote(e.target.value)} />
                <button className="bg-blue-600 text-white px-2 rounded"
                  onClick={() => { updateTask(task.id, { notes: note }); setEditingNote(false); }}>OK</button>
              </div>
            ) : (
              <p className="cursor-pointer text-gray-700 whitespace-pre-wrap" onClick={() => setEditingNote(true)}>
                {task.notes || '— добавить —'}
              </p>
            )}
          </div>

          <div>
            <p className="font-semibold mb-1">Фотографии</p>
            <div className="flex gap-2 flex-wrap">
              {task.attachments.map((a) => (
                <div key={a.id} className="relative">
                  {a.type === 'photo' && a.url && <img src={a.url} className="w-20 h-20 object-cover rounded" />}
                  <button className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5"
                    onClick={() => deleteAttachment(task.id, a.id)}>✕</button>
                </div>
              ))}
            </div>
            <label className="inline-block mt-1 text-blue-600 text-xs cursor-pointer">
              + добавить фото
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
