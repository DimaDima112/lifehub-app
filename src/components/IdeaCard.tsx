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
  const { updateIdea, deleteIdea, addIdeaPhoto, deleteIdeaPhoto } = useStore();
  const [open, setOpen] = useState(false);
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

  return (
    <div className={`border rounded-lg p-3 ${c.bg} ${c.border}`}>
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
        <div className="mt-3 space-y-3 text-sm">
          <p className="whitespace-pre-wrap text-gray-700">{idea.description || '— без описания —'}</p>

          <div className="flex gap-1 flex-wrap">
            {(Object.keys(statusStyle) as Idea['status'][]).map((st) => (
              <button
                key={st}
                onClick={() => updateIdea(idea.id, { status: st })}
                className={`text-xs px-2 py-1 rounded border ${
                  idea.status === st ? statusStyle[st].cls : 'bg-white'
                }`}
              >
                {statusStyle[st].label}
              </button>
            ))}
          </div>

          <div>
            <p className="font-semibold mb-1">Фотографии</p>
            <div className="flex gap-2 flex-wrap">
              {idea.photos.map((url, idx) => (
                <div key={idx} className="relative">
                  <img src={url} className="w-20 h-20 object-cover rounded" />
                  <button
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5"
                    onClick={() => deleteIdeaPhoto(idea.id, idx)}
                  >✕</button>
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
