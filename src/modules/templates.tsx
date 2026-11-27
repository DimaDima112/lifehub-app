import { useState } from 'react';
import { useStore } from '../store/appStore';
import type { TemplateItem, WorkoutTemplate, WorkoutExercise } from '../store/types';

export default function Templates() {
  const { 
    templates, topics, addTemplate, deleteTemplate, applyTemplate, 
    workoutTemplates, addWorkoutTemplate, deleteWorkoutTemplate, applyWorkoutTemplate, updateWorkoutTemplate 
  } = useStore();
  
  const [tab, setTab] = useState<'tasks' | 'workouts'>('tasks');

  // --- Стейты для шаблонов ЗАДАЧ ---
  const [name, setName] = useState('');
  const [topicId, setTopicId] = useState(topics[0]?.id ?? '');
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [itemTitle, setItemTitle] = useState('');

  // --- Стейты для шаблонов ТРЕНИРОВОК ---
  const [wName, setWName] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('10');
  
  // Редактирование шаблона тренировки
  const [editId, setEditId] = useState<string | null>(null);
  // Выбор даты для применения
  const [applyTplId, setApplyTplId] = useState<string | null>(null);
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
    if (!exName.trim()) return;
    setExercises([...exercises, { name: exName.trim(), sets: Number(exSets) || 3, reps: Number(exReps) || 10 }]);
    setExName(''); setExSets('3'); setExReps('10');
  };

  const submitWorkoutTemplate = () => {
    if (!wName.trim() || exercises.length === 0) return;
    
    if (editId) {
      updateWorkoutTemplate(editId, { name: wName.trim(), exercises });
      setEditId(null);
    } else {
      addWorkoutTemplate({ name: wName.trim(), exercises });
    }
    setWName(''); setExercises([]);
  };

  const startEditWorkout = (tpl: WorkoutTemplate) => {
    setEditId(tpl.id);
    setWName(tpl.name);
    setExercises(tpl.exercises);
    window.scrollTo(0, 0);
  };

  const handleApplyWorkout = () => {
    if (!applyTplId) return;
    applyWorkoutTemplate(applyTplId, applyDate);
    setApplyTplId(null);
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Шаблоны</h1>

      <div className="flex gap-1 mb-4 neo-inset p-1 rounded-xl">
        <button className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === 'tasks' ? 'neo-raised text-main' : 'text-muted'}`} onClick={() => setTab('tasks')}>Задачи</button>
        <button className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === 'workouts' ? 'neo-raised text-main' : 'text-muted'}`} onClick={() => setTab('workouts')}>Тренировки</button>
      </div>

      {tab === 'tasks' && (
        <>
          <div className="neo-inset p-3 mb-4 space-y-2">
            <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Название шаблона задач" value={name} onChange={(e) => setName(e.target.value)} />
            <select className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {topics.length === 0 && <option value="">Сначала создайте тему</option>}
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="flex gap-2">
              <input className="flex-1 neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Название задачи" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} />
              <button className="neo-btn px-3 text-lg" onClick={addItem}>+</button>
            </div>
            {items.length > 0 && <ul className="text-sm list-disc pl-5 text-main">{items.map((i, idx) => <li key={idx} className="flex justify-between py-1">{i.title}<button className="text-red-500 text-xs" onClick={() => setItems(items.filter((_, n) => n !== idx))}>✕</button></li>)}</ul>}
            <button className="neo-accent px-4 py-2 w-full text-sm mt-2" onClick={submitTaskTemplate} disabled={!name.trim() || items.length === 0}>Сохранить шаблон задач</button>
          </div>
          <div className="space-y-3">
            {templates.map((t) => (
              <div key={t.id} className="neo-raised p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold flex-1 text-main">{t.name}</span>
                  <button className="neo-btn px-3 py-1.5 text-xs text-green-600 font-bold" onClick={() => applyTemplate(t.id)}>Применить</button>
                  <button className="text-muted hover:text-red-500 w-7 h-7 flex items-center justify-center neo-btn" onClick={() => deleteTemplate(t.id)}>✕</button>
                </div>
                <ul className="text-sm text-muted list-disc pl-5">{t.items.map((i, idx) => <li key={idx}>{i.title}</li>)}</ul>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'workouts' && (
        <>
          <div className="neo-inset p-3 mb-4 space-y-2">
            <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Название тренировки (напр. 'Спина')" value={wName} onChange={(e) => setWName(e.target.value)} />
            
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="text-[10px] text-muted ml-1 mb-0.5 block">Упражнение</label>
                <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Жим лежа" value={exName} onChange={(e) => setExName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addExercise()} />
              </div>
              <div className="w-14">
                <label className="text-[10px] text-muted ml-1 mb-0.5 block">Подх.</label>
                <input type="number" className="w-full neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800 text-center" value={exSets} onChange={(e) => setExSets(e.target.value)} />
              </div>
              <div className="w-14">
                <label className="text-[10px] text-muted ml-1 mb-0.5 block">Повт.</label>
                <input type="number" className="w-full neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800 text-center" value={exReps} onChange={(e) => setExReps(e.target.value)} />
              </div>
              <button className="neo-btn px-3 h-[38px] text-lg" onClick={addExercise}>+</button>
            </div>

            {exercises.length > 0 && (
              <ul className="text-sm pl-1 space-y-1 mt-2">
                {exercises.map((ex, idx) => (
                  <li key={idx} className="flex justify-between text-main bg-[var(--bg-inset)] p-2 rounded">
                    <span>{ex.name} <span className="text-muted text-xs">({ex.sets}x{ex.reps})</span></span>
                    <button className="text-red-500 text-xs" onClick={() => setExercises(exercises.filter((_, n) => n !== idx))}>✕</button>
                  </li>
                ))}
              </ul>
            )}
            
            <button className={`w-full py-2 text-sm mt-2 ${editId ? 'neo-primary' : 'neo-accent'}`} onClick={submitWorkoutTemplate} disabled={!wName.trim() || exercises.length === 0}>
              {editId ? 'Сохранить изменения' : 'Сохранить шаблон тренировки'}
            </button>
            {editId && <button className="w-full py-2 text-sm neo-btn text-muted mt-2" onClick={() => { setEditId(null); setWName(''); setExercises([]); }}>Отмена</button>}
          </div>

          <div className="space-y-3">
            {workoutTemplates.map((t) => (
              <div key={t.id} className="neo-raised p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold flex-1 text-main">{t.name}</span>
                  <button className="neo-btn px-3 py-1.5 text-xs text-blue-600 font-bold" onClick={() => startEditWorkout(t)}>Ред.</button>
                  <button className="neo-btn px-3 py-1.5 text-xs text-green-600 font-bold" onClick={() => setApplyTplId(t.id)}>В Спорт</button>
                  <button className="text-muted hover:text-red-500 w-7 h-7 flex items-center justify-center neo-btn" onClick={() => deleteWorkoutTemplate(t.id)}>✕</button>
                </div>
                <ul className="text-sm text-muted pl-5 list-disc">
                  {t.exercises.map((ex, idx) => <li key={idx}>{ex.name} — {ex.sets} x {ex.reps}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Модалка выбора даты для тренировки */}
      {applyTplId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setApplyTplId(null)}>
          <div className="neo-raised w-full max-w-sm rounded-xl p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-main">На какой день добавить?</h3>
            <input type="date" className="w-full neo-inset px-4 py-3 text-lg mb-4 bg-white dark:bg-slate-800 text-main" value={applyDate} onChange={e => setApplyDate(e.target.value)} />
            <div className="flex gap-2">
              <button className="flex-1 neo-accent py-3 rounded-lg font-bold" onClick={handleApplyWorkout}>Добавить</button>
              <button className="flex-1 neo-btn py-3 rounded-lg text-muted" onClick={() => setApplyTplId(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
