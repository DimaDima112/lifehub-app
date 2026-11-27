import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/appStore';
import { colorMap } from '../utils/colors';
import type { Task } from '../store/types';
import HabitChart from '../components/HabitChart';

const today = () => new Date().toISOString().slice(0, 10);

export default function Planner() {
  const { date: urlDate } = useParams();
  const navigate = useNavigate();
  const date = urlDate ?? today();

  const { 
    topics, tasks, toggleTask, habits, logHabit, workouts, toggleWorkout, 
    updateTask, deleteTask, addQuickTask, addSubtask, deleteSubtask
  } = useStore();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Стейты для добавления новой задачи
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopicId, setNewTopicId] = useState(topics[0]?.id ?? '');

  // Стейты для РЕДАКТИРОВАНИЯ задачи
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editTopicId, setEditTopicId] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPriority, setEditPriority] = useState<'' | 'low' | 'medium' | 'high'>('');
  const [newSub, setNewSub] = useState('');

  // При открытии задачи сбрасываем режим редактирования и заполняем поля
  useEffect(() => {
    if (selectedTask) {
      setIsEditing(false);
      setEditTitle(selectedTask.title);
      setEditTopicId(selectedTask.topicId);
      setEditDueDate(selectedTask.dueDate || '');
      setEditNotes(selectedTask.notes || '');
      setEditPriority(selectedTask.priority || '');
      setNewSub('');
    }
  }, [selectedTask]);

  const dayTasks = tasks.filter((t) => !t.dueDate || t.dueDate === date);
  const dayWorkouts = workouts.filter((w) => w.date === date);

  const activeTasks = dayTasks.filter((t) => !t.done);
  const activeWorkouts = dayWorkouts.filter((w) => !w.done);

  const shiftDay = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    navigate(`/planner/${d.toISOString().slice(0, 10)}`);
  };

  const handleAddTask = () => {
    if (!newTitle.trim() || !newTopicId) return;
    addQuickTask(newTopicId, newTitle.trim(), date);
    setNewTitle('');
    setShowAdd(false);
  };

  const handleSaveEdit = () => {
    if (!selectedTask) return;
    updateTask(selectedTask.id, {
      title: editTitle.trim(),
      topicId: editTopicId,
      dueDate: editDueDate || undefined,
      notes: editNotes.trim() || undefined,
      priority: editPriority || undefined,
    });
    // Обновляем локальный стейт, чтобы модалка сразу показала новые данные
    setSelectedTask({
      ...selectedTask,
      title: editTitle.trim(),
      topicId: editTopicId,
      dueDate: editDueDate || undefined,
      notes: editNotes.trim() || undefined,
      priority: editPriority || undefined,
    });
    setIsEditing(false);
  };

  const handleAddSub = () => {
    if (!selectedTask || !newSub.trim()) return;
    addSubtask(selectedTask.id, newSub.trim());
    // Обновляем локально для мгновенного отображения
    const updatedSubs = [...selectedTask.subtasks, { id: Date.now().toString(), title: newSub.trim(), done: false }];
    setSelectedTask({ ...selectedTask, subtasks: updatedSubs });
    setNewSub('');
  };

  return (
    <div className="p-3 pb-24">
      <div className="flex items-center justify-between mb-4">
        <button className="w-10 h-10 flex items-center justify-center neo-btn rounded-lg" onClick={() => shiftDay(-1)}>←</button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-main">Планер</h1>
          <p className="text-xs text-muted">{date}{date === today() ? ' (сегодня)' : ''}</p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center neo-btn rounded-lg" onClick={() => shiftDay(1)}>→</button>
      </div>

      <div className="flex justify-center mb-4">
        <button className="text-xs neo-btn px-3 py-1 text-muted" onClick={() => navigate('/planner')}>на сегодня</button>
      </div>

      <h2 className="font-bold text-sm mb-2 text-main uppercase tracking-wide">Привычки</h2>
      <HabitChart habits={habits} date={date} />
      <div className="space-y-2 mb-6">
        {habits.map((h) => {
          const c = colorMap[h.color];
          const count = h.logs[date] ?? 0;
          return (
            <div key={h.id} className="flex items-center gap-2 p-2 neo-raised">
              <span className="flex-1 font-medium text-sm" style={{ color: c.hex }}>{h.name}</span>
              <button className="w-8 h-8 neo-btn rounded-md flex items-center justify-center text-lg" onClick={() => logHabit(h.id, date, -1)}>−</button>
              <span className="w-6 text-center font-bold text-sm">{count}</span>
              <button className="w-8 h-8 neo-btn rounded-md flex items-center justify-center text-lg" onClick={() => logHabit(h.id, date, 1)}>+</button>
            </div>
          );
        })}
      </div>

      <h2 className="font-bold text-sm mb-2 text-main uppercase tracking-wide">Задачи ({activeTasks.length})</h2>
      <div className="space-y-2 mb-6">
        {activeTasks.map((t) => {
          const topic = topics.find((tp) => tp.id === t.topicId);
          const c = topic ? colorMap[topic.color] : colorMap.blue;
          return (
            <div key={t.id} className="flex items-center gap-3 p-3 neo-raised cursor-pointer" onClick={() => setSelectedTask(t)}>
              <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
                <input type="checkbox" className="w-5 h-5 rounded accent-blue-600 cursor-pointer" onChange={() => toggleTask(t.id)} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-main block truncate">{t.title}</span>
                {t.subtasks.length > 0 && <span className="text-[10px] text-muted">{t.subtasks.filter(s=>s.done).length}/{t.subtasks.length} подзадач</span>}
              </div>
              {topic && <span className="text-[10px] font-bold px-2 py-1 rounded-md text-white shadow-sm shrink-0" style={{ backgroundColor: c.hex }}>{topic.name}</span>}
            </div>
          );
        })}
        {activeTasks.length === 0 && <p className="text-muted text-xs text-center py-2">Задач нет</p>}
      </div>

      <h2 className="font-bold text-sm mb-2 text-main uppercase tracking-wide">Тренировки ({activeWorkouts.length})</h2>
      <div className="space-y-2 mb-6">
        {activeWorkouts.map((w) => (
          <div key={w.id} className="flex items-center gap-3 p-3 neo-raised border-l-4 border-l-orange-500">
            <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
              <input type="checkbox" className="w-5 h-5 rounded accent-orange-500 cursor-pointer" onChange={() => toggleWorkout(w.id)} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-main block truncate">{w.plan}</span>
              {(w.sets || w.reps) && <span className="text-[10px] text-muted">{w.sets} подх. × {w.reps} повт.</span>}
            </div>
          </div>
        ))}
        {activeWorkouts.length === 0 && <p className="text-muted text-xs text-center py-2">Тренировок нет</p>}
      </div>

      <button 
        onClick={() => setShowAdd(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full neo-primary flex items-center justify-center text-2xl font-light shadow-xl z-40 transition-transform active:scale-95"
      >
        +
      </button>

      {/* Модалка ДОБАВЛЕНИЯ задачи */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="neo-raised w-full max-w-sm rounded-xl p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-main">Новая задача на {date}</h3>
            <input autoFocus className="w-full neo-inset px-3 py-2 text-sm mb-3 bg-white dark:bg-slate-800" placeholder="Название задачи..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
            <select className="w-full neo-inset px-3 py-2 text-sm mb-4 bg-white dark:bg-slate-800" value={newTopicId} onChange={(e) => setNewTopicId(e.target.value)}>
              <option value="">Выберите тему...</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button className="flex-1 neo-accent py-2 rounded-lg font-bold text-sm" onClick={handleAddTask}>Добавить</button>
              <button className="flex-1 neo-btn py-2 rounded-lg text-muted text-sm" onClick={() => setShowAdd(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка ПРОСМОТРА И РЕДАКТИРОВАНИЯ задачи */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end justify-center" onClick={() => setSelectedTask(null)}>
          <div className="neo-raised w-full max-w-md rounded-t-2xl p-5 max-h-[90vh] flex flex-col rounded-b-none border-b-0" onClick={e => e.stopPropagation()}>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input className="w-full neo-inset px-2 py-1 text-lg font-bold bg-white dark:bg-slate-800" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                ) : (
                  <h2 className="text-lg font-bold text-main truncate">{selectedTask.title}</h2>
                )}
                <p className="text-xs text-muted mt-1">{selectedTask.dueDate ? `Дедлайн: ${selectedTask.dueDate}` : 'Без даты'}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="neo-btn w-8 h-8 rounded-full flex items-center justify-center text-muted ml-2 shrink-0">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              
              {/* Кнопки управления: Выполнено / Редактировать / Удалить */}
              {!isEditing && (
                <div className="flex gap-2 flex-wrap">
                  <button className={`flex-1 py-2 rounded-lg text-sm font-medium ${selectedTask.done ? 'neo-btn text-green-600' : 'neo-primary'}`} onClick={() => { toggleTask(selectedTask.id); setSelectedTask(null); }}>
                    {selectedTask.done ? 'Вернуть в работу' : 'Выполнено'}
                  </button>
                  <button className="neo-btn px-3 py-2 text-sm font-medium text-main" onClick={() => setIsEditing(true)}>Изменить</button>
                  <button className="neo-btn px-3 py-2 text-red-500 rounded-lg text-sm" onClick={() => { deleteTask(selectedTask.id); setSelectedTask(null); }}>Удалить</button>
                </div>
              )}

              {/* РЕЖИМ РЕДАКТИРОВАНИЯ */}
              {isEditing && (
                <div className="neo-inset p-3 space-y-3 mb-2">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase mb-1 block">Тема</label>
                    <select className="w-full neo-inset px-2 py-1 text-sm bg-white dark:bg-slate-800" value={editTopicId} onChange={e => setEditTopicId(e.target.value)}>
                      {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase mb-1 block">Дата (Дедлайн)</label>
                    <input type="date" className="w-full neo-inset px-2 py-1 text-sm bg-white dark:bg-slate-800" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase mb-1 block">Приоритет</label>
                    <select className="w-full neo-inset px-2 py-1 text-sm bg-white dark:bg-slate-800" value={editPriority} onChange={e => setEditPriority(e.target.value as any)}>
                      <option value="">Не указан</option>
                      <option value="high">🔴 Высокий</option>
                      <option value="medium">🟡 Средний</option>
                      <option value="low">🟢 Низкий</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase mb-1 block">Пометки / Описание</label>
                    <textarea className="w-full neo-inset px-2 py-1 text-sm bg-white dark:bg-slate-800" rows={3} value={editNotes} onChange={e => setEditNotes(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 neo-accent py-2 rounded-lg text-sm" onClick={handleSaveEdit}>Сохранить</button>
                    <button className="flex-1 neo-btn py-2 rounded-lg text-sm text-muted" onClick={() => setIsEditing(false)}>Отмена</button>
                  </div>
                </div>
              )}

              {/* ПРОСМОТР ДАННЫХ (когда не редактируем) */}
              {!isEditing && (
                <>
                  {selectedTask.priority && (
                    <div className="text-sm">
                      <span className="text-muted">Приоритет: </span>
                      <span className="font-bold">{selectedTask.priority === 'high' ? '🔴 Высокий' : selectedTask.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}</span>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs font-bold text-muted uppercase mb-2">Подзадачи</p>
                    <div className="space-y-1 mb-2">
                      {selectedTask.subtasks.map(st => (
                        <div key={st.id} className="flex items-center gap-2 p-2 neo-inset rounded-md">
                          <input type="checkbox" checked={st.done} onChange={() => {
                            const updated = selectedTask.subtasks.map(s => s.id === st.id ? { ...s, done: !s.done } : s);
                            updateTask(selectedTask.id, { subtasks: updated });
                            setSelectedTask({ ...selectedTask, subtasks: updated });
                          }} className="w-4 h-4 rounded accent-blue-600" />
                          <span className={`text-sm flex-1 ${st.done ? 'line-through text-muted' : 'text-main'}`}>{st.title}</span>
                          <button className="text-red-400 hover:text-red-600 text-[10px]" onClick={() => {
                            deleteSubtask(selectedTask.id, st.id);
                            setSelectedTask({ ...selectedTask, subtasks: selectedTask.subtasks.filter(s => s.id !== st.id) });
                          }}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <input className="flex-1 neo-inset px-2 py-1 text-sm bg-white dark:bg-slate-800" placeholder="+ новая подзадача" value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSub()} />
                      <button className="neo-btn px-3 text-lg rounded-md" onClick={handleAddSub}>+</button>
                    </div>
                  </div>

                  {selectedTask.notes && (
                    <div>
                      <p className="text-xs font-bold text-muted uppercase mb-2">Пометки</p>
                      <p className="text-sm text-main whitespace-pre-wrap neo-inset p-3">{selectedTask.notes}</p>
                    </div>
                  )}
                  
                  {selectedTask.attachments.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-muted uppercase mb-2">Фотографии</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedTask.attachments.map(a => a.url && <img key={a.id} src={a.url} className="w-20 h-20 object-cover rounded-lg shadow-sm" />)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
