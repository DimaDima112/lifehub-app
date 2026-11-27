import { useState } from 'react';
import { useStore } from '../store/appStore';
import type { TemplateItem } from '../store/types';

export default function Templates() {
  const { templates, topics, addTemplate, deleteTemplate, applyTemplate, workoutTemplates, addWorkoutTemplate, deleteWorkoutTemplate, applyWorkoutTemplate } = useStore();
  const [tab, setTab] = useState<'tasks' | 'workouts'>('tasks');

  // Стейты для шаблона задач
  const [name, setName] = useState('');
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [itemTitle, setItemTitle] = useState('');

  // Стейты для шаблона тренировок
  const [wName, setWName] = useState('');
  const [exercises, setExercises] = useState<string[]>([]);
  const [exInput, setExInput] = useState('');
  const [applyDate, setApplyDate] = useState(new Date().toISOString().slice(0, 10));

  const addItem = () => {
    if (!itemTitle.trim()) return;
    setItems([...items, { title: itemTitle.trim(), subtasks: [] }]);
    setItemTitle('');
  };

  const submitTaskTemplate = () => {
    if (!name.trim() || items.length === 0) return;
    addTemplate({ name: name.trim(), topicId: topicId || undefined, items });
    setName(''); setItems([]);
  };

  const addExercise = () => {
    if (!exInput.trim()) return;
    setExercises([...exercises, exInput.trim()]);
    setExInput('');
  };

  const submitWorkoutTemplate = () => {
    if (!wName.trim() || exercises.length === 0) return;
    addWorkoutTemplate({ name: wName.trim(), exercises });
    setWName(''); setExercises([]);
  };

  return (
    <div className="p-3">
      <h1 className="text-xl font-bold mb-3">Шаблоны</h1>

      <div className="flex gap-1 mb-3 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
        <button className={`flex-1 py-1.5 text-sm font-medium rounded-md ${tab === 'tasks' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500'}`} onClick={() => setTab('tasks')}>Задачи</button>
        <button className={`flex-1 py-1.5 text-sm font-medium rounded-md ${tab === 'workouts' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-gray-500'}`} onClick={() => setTab('workouts')}>Тренировки</button>
      </div>

      {tab === 'tasks' && (
        <>
          <div className="border rounded-lg p-3 mb-4 bg-gray-50 dark:bg-slate-800 space-y-2">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Название шаблона задач" value={name} onChange={(e) => setName(e.target.value)} />
            <select className="w-full border rounded px-2 py-1 text-sm" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {topics.length === 0 && <option value="">Сначала создайте тему</option>}
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="flex gap-2">
              <input className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Название задачи" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} />
              <button className="bg-gray-600 text-white px-3 rounded text-sm" onClick={addItem}>+</button>
            </div>
            {items.length > 0 && <ul className="text-sm list-disc pl-5">{items.map((i, idx) => <li key={idx} className="flex justify-between">{i.title}<button className="text-red-600 text-xs" onClick={() => setItems(items.filter((_, n) => n !== idx))}>✕</button></li>)}</ul>}
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full text-sm" onClick={submitTaskTemplate} disabled={!name.trim() || items.length === 0}>Сохранить шаблон задач</button>
          </div>
          <div className="space-y-2">
            {templates.map((t) => (
              <div key={t.id} className="border rounded p-3 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium flex-1">{t.name}</span>
                  <button className="bg-green-600 text-white text-xs px-2 py-1 rounded" onClick={() => applyTemplate(t.id)}>Применить</button>
                  <button className="text-red-600 text-xs" onClick={() => deleteTemplate(t.id)}>✕</button>
                </div>
                <ul className="text-sm text-gray-500 mt-1 list-disc pl-5">{t.items.map((i, idx) => <li key={idx}>{i.title}</li>)}</ul>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'workouts' && (
        <>
          <div className="border rounded-lg p-3 mb-4 bg-gray-50 dark:bg-slate-800 space-y-2">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Название тренировки (напр. 'Спина')" value={wName} onChange={(e) => setWName(e.target.value)} />
            <div className="flex gap-2">
              <input className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Упражнение (напр. 'Тяга штанги')" value={exInput} onChange={(e) => setExInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addExercise()} />
              <button className="bg-gray-600 text-white px-3 rounded text-sm" onClick={addExercise}>+</button>
            </div>
            {exercises.length > 0 && <ul className="text-sm list-disc pl-5">{exercises.map((ex, idx) => <li key={idx} className="flex justify-between">{ex}<button className="text-red-600 text-xs" onClick={() => setExercises(exercises.filter((_, n) => n !== idx))}>✕</button></li>)}</ul>}
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full text-sm" onClick={submitWorkoutTemplate} disabled={!wName.trim() || exercises.length === 0}>Сохранить шаблон</button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs text-gray-500">Дата для добавления:</label>
              <input type="date" className="border rounded px-2 py-1 text-sm" value={applyDate} onChange={e => setApplyDate(e.target.value)} />
            </div>
            {workoutTemplates.map((t) => (
              <div key={t.id} className="border rounded p-3 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium flex-1">{t.name}</span>
                  <button className="bg-green-600 text-white text-xs px-2 py-1 rounded" onClick={() => applyWorkoutTemplate(t.id, applyDate)}>В Спорт</button>
                  <button className="text-red-600 text-xs" onClick={() => deleteWorkoutTemplate(t.id)}>✕</button>
                </div>
                <ul className="text-sm text-gray-500 mt-1 list-disc pl-5">{t.exercises.map((ex, idx) => <li key={idx}>{ex}</li>)}</ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
