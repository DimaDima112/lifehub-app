import { useState } from 'react';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import type { Idea, ThemeColor } from '../store/types';

const statusStyle: Record<Idea['status'], { label: string; cls: string }> = {
  success: { label: '✅ Получилось', cls: 'bg-green-600 text-white' },
  fail:    { label: '❌ Не получилось', cls: 'bg-red-600 text-white' },
  pending: { label: '⏳ В процессе', cls: 'bg-yellow-500 text-white' },
};

export default function IdeaCard({ idea, color }: { idea: Idea; color: ThemeColor }) {
  const { topics, updateIdea, deleteIdea, addIdeaPhoto, deleteIdeaPhoto, updateIdeaInfo, addIdeaComment, deleteIdeaComment } = useStore();
  
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Стейты для редактирования
  const [editTitle, setEditTitle] = useState(idea.title);
  const [editDesc, setEditDesc] = useState(idea.description);
  const [editTopicId, setEditTopicId] = useState(idea.topicId);
  
  // Стейт для нового комментария
  const [newComment, setNewComment] = useState('');
  
  const c = colorMap[color];

  const fileToBase64 = (file: File) =>
    new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(file);
    });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    addIdeaPhoto(idea.id, await fileToBase64(f));
    e.target.value = '';
  };

  const handleSaveInfo = () => {
    if (!editTitle.trim()) return;
    updateIdeaInfo(idea.id, editTitle.trim(), editDesc.trim(), editTopicId);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addIdeaComment(idea.id, newComment.trim());
    setNewComment('');
  };

  return (
    <div className={`border rounded-lg p-3 ${c.bg} ${c.border}`}>
      {/* Заголовок карточки */}
      <div className="flex items-center gap-2">
        <span className={`flex-1 font-medium cursor-pointer ${c.text}`} onClick={() => setOpen((v) => !v)}>
          {idea.title}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${statusStyle[idea.status].cls}`}>
          {statusStyle[idea.status].label}
        </span>
        <button className="text-red-600 text-sm" onClick={() => deleteIdea(idea.id)}>✕</button>
      </div>

      {open && (
        <div className="mt-3 space-y-4 text-sm">
          
          {/* Блок редактирования / просмотра */}
          {isEditing ? (
            <div className="space-y-2 bg-white dark:bg-slate-800 p-2 rounded border dark:border-slate-600">
              <input className="w-full border rounded px-2 py-1" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Заголовок" />
              <textarea className="w-full border rounded px-2 py-1" rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Описание" />
              <select className="w-full border rounded px-2 py-1" value={editTopicId} onChange={e => setEditTopicId(e.target.value)}>
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={handleSaveInfo}>Сохранить</button>
                <button className="px-3 py-1 border rounded text-xs" onClick={() => setIsEditing(false)}>Отмена</button>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 pr-8">{idea.description || '— без описания —'}</p>
              <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 text-blue-600 text-xs opacity-50 hover:opacity-100">
                ✏️ Ред.
              </button>
            </div>
          )}

          {/* Статусы */}
          <div className="flex gap-1 flex-wrap">
            {(Object.keys(statusStyle) as Idea['status'][]).map((st) => (
              <button
                key={st}
                onClick={() => updateIdea(idea.id, { status: st })}
                className={`text-xs px-2 py-1 rounded border ${idea.status === st ? statusStyle[st].cls : 'bg-white dark:bg-slate-700'}`}
              >
                {statusStyle[st].label}
              </button>
            ))}
          </div>

          {/* Комментарии */}
          <div className="bg-white dark:bg-slate-800 rounded border dark:border-slate-600 p-2">
            <p className="font-semibold mb-2 text-xs text-gray-500 uppercase tracking-wide">Комментарии</p>
            
            <div className="space-y-3 mb-3 max-h-48 overflow-y-auto pr-1">
              {(idea.comments || []).length === 0 && <p className="text-xs text-gray-400">Пока нет комментариев</p>}
              {(idea.comments || []).map((comment) => (
                <div key={comment.id} className="border-l-2 border-gray-300 dark:border-slate-500 pl-2">
                  <p className="text-gray-800 dark:text-gray-200">{comment.text}</p>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[10px] text-gray-400">{comment.date}</span>
                    <button onClick={() => deleteIdeaComment(idea.id, comment.id)} className="text-red-400 hover:text-red-600 text-[10px]">Удалить</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              <input 
                className="flex-1 border rounded px-2 py-1 text-xs" 
                placeholder="Добавить комментарий..." 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              />
              <button className="bg-gray-800 text-white px-2 rounded text-xs" onClick={handleAddComment}>OK</button>
            </div>
          </div>

          {/* Фотографии */}
          <div>
            <p className="font-semibold mb-1 text-xs text-gray-500 uppercase tracking-wide">Фотографии</p>
            <div className="flex gap-2 flex-wrap">
              {idea.photos.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={url} className="w-16 h-16 object-cover rounded" />
                  <button className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4" onClick={() => deleteIdeaPhoto(idea.id, idx)}>✕</button>
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
