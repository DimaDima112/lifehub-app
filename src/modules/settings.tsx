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
      version: 10,
      exportedAt: new Date().toISOString(),
      topics: store.topics, tasks: store.tasks, habits: store.habits,
      ideas: store.ideas, finances: store.finances, dates: store.dates,
      workouts: store.workouts,
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
        workouts: data.workouts ?? [],
      });
      toast.success('Данные загружены');
    } catch {
      toast.error('Файл повреждён');
    }
    e.target.value = '';
  };

  return (
    <div className="p-3">
      <h1 className="text-xl font-bold mb-3">Настройки</h1>

      <div className="border rounded-lg p-3 mb-3">
        <p className="font-semibold text-sm mb-2">Тема оформления</p>
        <div className="flex gap-2">
          <button
            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${store.theme === 'light' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800'}`}
            onClick={() => store.setTheme('light')}
          >☀️ Светлая</button>
          <button
            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${store.theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800'}`}
            onClick={() => store.setTheme('dark')}
          >🌙 Тёмная</button>
        </div>
      </div>

      <div className="border rounded-lg p-3 mb-3">
        <p className="font-semibold text-sm mb-2">Акцентный цвет</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { cls: '', label: 'Синий', bg: '#2563eb' },
            { cls: 'accent-green', label: 'Зелёный', bg: '#16a34a' },
            { cls: 'accent-purple', label: 'Фиолет.', bg: '#9333ea' },
            { cls: 'accent-orange', label: 'Оранж.', bg: '#ea580c' },
          ].map((a) => (
            <button key={a.cls}
              className="px-3 py-1.5 rounded-lg text-xs text-white"
              style={{ backgroundColor: a.bg }}
              onClick={() => {
                document.documentElement.classList.remove('accent-green', 'accent-purple', 'accent-orange');
                if (a.cls) document.documentElement.classList.add(a.cls);
                toast.success(`Цвет: ${a.label}`);
              }}>{a.label}</button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-3 mb-3"><p className="font-semibold text-sm mb-2">Установка приложения</p><InstallPWA /></div>
<div className="border rounded-lg p-3 mb-3">
        <p className="font-semibold text-sm mb-2">Резервная копия</p>
        <p className="text-xs text-gray-500 mb-2">Сохраняет все данные в JSON.</p>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm" onClick={exportData}>
            ⬇ Скачать
          </button>
          <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm" onClick={() => fileRef.current?.click()}>
            ⬆ Загрузить
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importData} />
        </div>
      </div>

      <div className="border rounded-lg p-3 text-sm">
        <p className="font-semibold mb-2">Статистика</p>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
          <li>Темы: {store.topics.length}</li>
          <li>Задачи: {store.tasks.length}</li>
          <li>Привычки: {store.habits.length}</li>
          <li>Идеи: {store.ideas.length}</li>
          <li>Финансы: {store.finances.length}</li>
          <li>Даты: {store.dates.length}</li>
          <li>Тренировки: {store.workouts.length}</li>
          <li>Шаблоны: {store.templates.length}</li>
        </ul>
      </div>
    </div>
  );
}
