import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Topic, Task, Habit, Idea, FinanceEntry, ImportantDate, Workout, Attachment, Template, TemplateItem, WorkoutTemplate } from './types';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;

  topics: Topic[]; tasks: Task[]; habits: Habit[]; ideas: Idea[];
  finances: FinanceEntry[]; dates: ImportantDate[]; workouts: Workout[];
  templates: Template[]; workoutTemplates: WorkoutTemplate[];

  addTopic: (t: Omit<Topic, 'id'>) => void;
  updateTopic: (id: string, patch: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;

  addTask: (t: Omit<Task, 'id'>) => void;
  addQuickTask: (topicId: string, title: string, date: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;

  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  deleteSubtask: (taskId: string, subId: string) => void;

  addAttachment: (taskId: string, att: Omit<Attachment, 'id'>) => void;
  deleteAttachment: (taskId: string, attId: string) => void;

  addHabit: (h: Omit<Habit, 'id'>) => void;
  deleteHabit: (id: string) => void;
  logHabit: (id: string, date: string, delta: number) => void;

  addIdea: (i: Omit<Idea, 'id'>) => void;
  updateIdea: (id: string, patch: Partial<Idea>) => void;
  updateIdeaInfo: (id: string, title: string, desc: string, topicId: string) => void;
  deleteIdea: (id: string) => void;
  addIdeaPhoto: (id: string, url: string) => void;
  deleteIdeaPhoto: (id: string, index: number) => void;
  addIdeaComment: (ideaId: string, text: string) => void;
  deleteIdeaComment: (ideaId: string, commentId: string) => void;

  addFinance: (f: Omit<FinanceEntry, 'id'>) => void;
  deleteFinance: (id: string) => void;

  addDate: (d: Omit<ImportantDate, 'id'>) => void;
  updateDate: (id: string, patch: Partial<ImportantDate>) => void;
  deleteDate: (id: string) => void;

  addWorkout: (w: Omit<Workout, 'id'>) => void;
  toggleWorkout: (id: string) => void;
  deleteWorkout: (id: string) => void;

  addTemplate: (t: Omit<Template, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  applyTemplate: (id: string, date?: string) => void;

  addWorkoutTemplate: (t: Omit<WorkoutTemplate, 'id'>) => void;
  deleteWorkoutTemplate: (id: string) => void;
  applyWorkoutTemplate: (id: string, date: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const shiftDate = (dateStr: string, rec: 'daily' | 'weekly' | 'monthly'): string => {
  const d = new Date(dateStr);
  if (rec === 'daily') d.setDate(d.getDate() + 1);
  if (rec === 'weekly') d.setDate(d.getDate() + 7);
  if (rec === 'monthly') d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (t) => {
        set({ theme: t });
        document.documentElement.classList.toggle('dark', t === 'dark');
      },

      topics: [], tasks: [], habits: [], ideas: [],
      finances: [], dates: [], workouts: [], templates: [], workoutTemplates: [],

      addTopic: (t) => set((s) => ({ topics: [...s.topics, { ...t, id: uid() }] })),
      updateTopic: (id, patch) =>
        set((s) => ({ topics: s.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      deleteTopic: (id) =>
        set((s) => ({
          topics: s.topics.filter((t) => t.id !== id),
          tasks: s.tasks.filter((t) => t.topicId !== id),
          ideas: s.ideas.filter((i) => i.topicId !== id),
        })),

      addTask: (t) => set((s) => ({ tasks: [...s.tasks, { ...t, id: uid() }] })),
      addQuickTask: (topicId, title, date) => set((s) => ({ tasks: [...s.tasks, { id: uid(), topicId, title, done: false, dueDate: date, subtasks: [], attachments: [] }] })),
      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) =>
        set((s) => {
          const task = s.tasks.find((t) => t.id === id);
          if (!task) return {};
          const willDone = !task.done;
          if (willDone && task.recurrence && task.recurrence !== 'none' && task.dueDate) {
            const next: Task = {
              ...task, id: uid(), done: false,
              subtasks: task.subtasks.map((st) => ({ ...st, id: uid(), done: false })),
              dueDate: shiftDate(task.dueDate, task.recurrence),
            };
            return { tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: true } : t)).concat(next) };
          }
          return { tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: willDone } : t)) };
        }),
      archiveTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: true } : t)) })),
      restoreTask: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: false } : t)) })),

      addSubtask: (taskId, title) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, subtasks: [...t.subtasks, { id: uid(), title, done: false }] } : t
          ),
        })),
      toggleSubtask: (taskId, subId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.map((st) => st.id === subId ? { ...st, done: !st.done } : st) }
              : t
          ),
        })),
      deleteSubtask: (taskId, subId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subId) } : t
          ),
        })),

      addAttachment: (taskId, att) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, attachments: [...t.attachments, { ...att, id: uid() }] } : t
          ),
        })),
      deleteAttachment: (taskId, attId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, attachments: t.attachments.filter((a) => a.id !== attId) } : t
          ),
        })),

      addHabit: (h) => set((s) => ({ habits: [...s.habits, { ...h, id: uid() }] })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      logHabit: (id, date, delta) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h;
            const current = h.logs[date] ?? 0;
            return { ...h, logs: { ...h.logs, [date]: Math.max(0, current + delta) } };
          }),
        })),

      addIdea: (i) => set((s) => ({ ideas: [...s.ideas, { ...i, id: uid(), comments: i.comments || [] }] })),
      updateIdea: (id, patch) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      updateIdeaInfo: (id, title, desc, topicId) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, title, description: desc, topicId } : i)) })),
      deleteIdea: (id) => set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),
      addIdeaPhoto: (id, url) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, photos: [...i.photos, url] } : i)) })),
      deleteIdeaPhoto: (id, index) =>
        set((s) => ({
          ideas: s.ideas.map((i) => (i.id === id ? { ...i, photos: i.photos.filter((_, idx) => idx !== index) } : i)),
        })),
      addIdeaComment: (ideaId, text) =>
        set((s) => ({
          ideas: s.ideas.map((i) =>
            i.id === ideaId
              ? { ...i, comments: [...(i.comments || []), { id: uid(), text, date: new Date().toISOString().slice(0, 10) }] }
              : i
          ),
        })),
      deleteIdeaComment: (ideaId, commentId) =>
        set((s) => ({
          ideas: s.ideas.map((i) =>
            i.id === ideaId ? { ...i, comments: (i.comments || []).filter((c) => c.id !== commentId) } : i
          ),
        })),

      addFinance: (f) => set((s) => ({ finances: [...s.finances, { ...f, id: uid() }] })),
      deleteFinance: (id) => set((s) => ({ finances: s.finances.filter((f) => f.id !== id) })),

      addDate: (d) => set((s) => ({ dates: [...s.dates, { ...d, id: uid() }] })),
      updateDate: (id, patch) =>
        set((s) => ({ dates: s.dates.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      deleteDate: (id) => set((s) => ({ dates: s.dates.filter((d) => d.id !== id) })),

      addWorkout: (w) => set((s) => ({ workouts: [...s.workouts, { ...w, id: uid() }] })),
      toggleWorkout: (id) =>
        set((s) => ({ workouts: s.workouts.map((w) => (w.id === id ? { ...w, done: !w.done } : w)) })),
      deleteWorkout: (id) => set((s) => ({ workouts: s.workouts.filter((w) => w.id !== id) })),

      addTemplate: (t) => set((s) => ({ templates: [...s.templates, { ...t, id: uid() }] })),
      deleteTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
      applyTemplate: (id, date) => {
        const tpl = get().templates.find((t) => t.id === id);
        if (!tpl) return;
        const topicId = tpl.topicId ?? get().topics[0]?.id;
        if (!topicId) return;
        const newTasks: Task[] = tpl.items.map((item: TemplateItem) => ({
          id: uid(), topicId, title: item.title, done: false, dueDate: date,
          subtasks: item.subtasks.map((st) => ({ id: uid(), title: st, done: false })),
          attachments: [],
        }));
        set((s) => ({ tasks: [...s.tasks, ...newTasks] }));
      },

      addWorkoutTemplate: (t) => set((s) => ({ workoutTemplates: [...s.workoutTemplates, { ...t, id: uid() }] })),
      deleteWorkoutTemplate: (id) => set((s) => ({ workoutTemplates: s.workoutTemplates.filter((t) => t.id !== id) })),
      applyWorkoutTemplate: (id, date) => {
        const tpl = get().workoutTemplates.find((t) => t.id === id);
        if (!tpl) return;
        const newWorkouts: Workout[] = tpl.exercises.map((ex) => ({
          id: uid(), date, slot: 'day', plan: ex, done: false,
        }));
        set((s) => ({ workouts: [...s.workouts, ...newWorkouts] }));
      },
    }),
    { name: 'lifehub-v12' }
  )
);
