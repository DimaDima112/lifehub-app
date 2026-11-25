export type ThemeColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';

export interface Subtask { id: string; title: string; done: boolean; }
export interface Attachment { id: string; type: 'photo' | 'note'; url?: string; text?: string; }

export interface Topic {
  id: string;
  name: string;
  color: ThemeColor;
  icon?: string;
}

export interface Task {
  id: string;
  topicId: string;
  title: string;
  done: boolean;
  dueDate?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  priority?: 'low' | 'medium' | 'high';
  subtasks: Subtask[];
  attachments: Attachment[];
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: 'mind' | 'strength' | 'endurance' | 'other';
  color: ThemeColor;
  dailyTarget: number;
  logs: Record<string, number>;
}

export interface Idea {
  id: string;
  topicId: string;
  title: string;
  description: string;
  status: 'success' | 'fail' | 'pending';
  photos: string[];
  date: string;
}

export interface FinanceEntry {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  source: string;
  category?: string;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  phone?: string;
  note?: string;
  reminderDays: number;
  recurring?: 'none' | 'monthly' | 'yearly';
}

export interface Workout {
  id: string;
  date: string;
  slot: 'morning' | 'day' | 'evening';
  plan: string;
  done: boolean;
  progressPhoto?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  url: string;
}

export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface TemplateItem {
  title: string;
  subtasks: string[];
}

export interface Template {
  id: string;
  name: string;
  topicId?: string;
  items: TemplateItem[];
}
