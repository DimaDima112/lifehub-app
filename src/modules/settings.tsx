import { useRef, useEffect } from 'react';
import { useStore } from '../store/appStore';
import { toast } from 'sonner';
import InstallPWA from '../components/InstallPWA';

export default function Settings() {
  const store = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', store.theme === 'dark');
  }, [store.theme]);

  const exportData = () => {
    const data = {
      version: 12, exportedAt: new Date().toISOString(),
      topics: store.topics, tasks: store.tasks, habits: store.habits,
      ideas: store.ideas, finances: store.finances, dates: store.dates,
      workouts: store.workouts, templates: store.templates, workoutTemplates: store.workoutTemplates
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifehub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Копия скачана');
  };

  const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!confirm('Заменить все текущие данные?')) { e.target.value = ''; return; }
      useStore.setState({
        topics: data.topics ?? [], tasks: data.tasks ?? [], habits: data.habits ?? [],
        ideas: data.ideas ?? [], finances: data.finances ?? [], dates: data.dates ?? [],
        workouts: data.workouts ?? [], templates: data.templates ?? [], workoutTemplates: data.workoutTemplates ?? []
      });
      toast.success('Данные загружены');
    } catch {
      toast.error('Файл повреждён');
    }
    e.target.value = '';
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Настройки</h1>

      <div className="neo-raised p-4 mb-4">
        <p className="font-bold text-sm mb-3 text-main uppercase tracking-wide">Тема оформления</p>
        <div className="flex gap-2">
          <button className={`flex-1 py-2 rounded-lg font-bold border ${store.theme === 'light' ? 'neo-primary border-transparent' : 'neo-btn text-muted'}`} onClick={() => store.setTheme('light')}>☀️ Светлая</button>
          <button className={`flex-1 py-2 rounded-lg font-bold border ${store.theme === 'dark' ? 'neo-primary border-transparent' : 'neo-btn text-muted'}`} onClick={() => store.setTheme('dark')}>🌙 Тёмная</button>
        </div>
      </div>

      <div className="neo-raised p-4 mb-4">
        <p className="font-bold text-sm mb-3 text-main uppercase tracking-wide">Акцентный цвет</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { cls: '', label: 'Синий', bg: '#2563eb' },
            { cls: 'accent-green', label: 'Зелёный', bg: '#16a34a' },
            { cls: 'accent-purple', label: 'Фиолет.', bg: '#9333ea' },
            { cls: 'accent-orange', label: 'Оранж.', bg: '#ea580c' },
          ].map((a) => (
            <button key={a.cls} className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm" style={{ backgroundColor: a.bg }}
              onClick={() => {
                document.documentElement.classList.remove('accent-green', 'accent-purple', 'accent-orange');
                if (a.cls) document.documentElement.classList.add(a.cls);
                toast.success(`Цвет: ${a.label}`);
              }}>{a.label}</button>
          ))}
        </div>
      </div>

      <div className="neo-raised p-4 mb-4">
        <p className="font-bold text-sm mb-3 text-main uppercase tracking-wide">Установка приложения</p>
        <InstallPWA />
      </div>

      <div className="neo-raised p-4 mb-4">
        <p className="font-bold text-sm mb-3 text-main uppercase tracking-wide">Резервная копия</p>
        <div className="flex gap-2">
          <button className="flex-1 neo-accent px-3 py-2 text-sm" onClick={exportData}>⬇ Скачать</button>
          <button className="flex-1 neo-btn px-3 py-2 text-sm text-main" onClick={() => fileRef.current?.click()}>⬆ Загрузить</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importData} />
        </div>
      </div>

      <div className="neo-raised p-4">
        <p className="font-bold text-sm mb-3 text-main uppercase tracking-wide">Статистика</p>
        <ul className="space-y-1 text-xs font-medium text-muted">
          <li className="flex justify-between"><span>Темы:</span> <span className="text-main">{store.topics.length}</span></li>
          <li className="flex justify-between"><span>Задачи:</span> <span className="text-main">{store.tasks.length}</span></li>
          <li className="flex justify-between"><span>Привычки:</span> <span className="text-main">{store.habits.length}</span></li>
          <li className="flex justify-between"><span>Идеи:</span> <span className="text-main">{store.ideas.length}</span></li>
          <li className="flex justify-between"><span>Финансы:</span> <span className="text-main">{store.finances.length}</span></li>
          <li className="flex justify-between"><span>Даты:</span> <span className="text-main">{store.dates.length}</span></li>
          <li className="flex justify-between"><span>Тренировки:</span> <span className="text-main">{store.workouts.length}</span></li>
        </ul>
      </div>
    </div>
  );
}
