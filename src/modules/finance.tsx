import { useState } from 'react';
import { useStore } from '../store/appStore';
import FinanceChart from '../components/FinanceChart';
import type { FinanceEntry } from '../store/types';

const today = () => new Date().toISOString().slice(0, 10);
const fmtMoney = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

function exportCSV(entries: FinanceEntry[]) {
  const header = 'Дата,Тип,Сумма,Источник,Категория\n';
  const rows = entries.map((e) =>
    [e.date, e.type === 'income' ? 'доход' : 'расход', e.amount, `"${e.source}"`, `"${e.category ?? ''}"`].join(',')
  ).join('\n');
  const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finance-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Finance() {
  const { finances, addFinance, deleteFinance } = useStore();
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(today());
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('month');

  const year = new Date().getFullYear();
  const periodKey = () => {
    if (period === 'day') return today();
    if (period === 'month') return today().slice(0, 7);
    return String(year);
  };

  const inPeriod = finances.filter((f) => f.date.startsWith(periodKey()));
  const income = inPeriod.filter((f) => f.type === 'income').reduce((s, f) => s + f.amount, 0);
  const expense = inPeriod.filter((f) => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
  const balance = income - expense;

  const submit = () => {
    const num = Number(amount);
    if (!num || !source.trim()) return;
    addFinance({ date, type, amount: num, source: source.trim(), category: category.trim() || undefined });
    setAmount(''); setSource(''); setCategory('');
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-4 text-main tracking-tight">Финансы</h1>

      <div className="flex gap-1 mb-4 neo-inset p-1 rounded-xl">
        {(['day', 'month', 'year'] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 px-2 py-1.5 text-sm font-bold rounded-lg transition-all ${period === p ? 'neo-raised text-main' : 'text-muted'}`}>
            {p === 'day' ? 'День' : p === 'month' ? 'Месяц' : 'Год'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="neo-raised p-3 text-center border-t-2 border-t-green-500">
          <p className="text-[10px] text-muted uppercase font-bold">Доход</p>
          <p className="font-bold text-green-600 text-sm mt-1 break-all">{fmtMoney(income)}</p>
        </div>
        <div className="neo-raised p-3 text-center border-t-2 border-t-red-500">
          <p className="text-[10px] text-muted uppercase font-bold">Расход</p>
          <p className="font-bold text-red-600 text-sm mt-1 break-all">{fmtMoney(expense)}</p>
        </div>
        <div className="neo-raised p-3 text-center border-t-2 border-t-blue-500">
          <p className="text-[10px] text-muted uppercase font-bold">Баланс</p>
          <p className="font-bold text-main text-sm mt-1 break-all">{fmtMoney(balance)}</p>
        </div>
      </div>

      <div className="neo-inset p-4 mb-6 space-y-3">
        <p className="text-sm font-bold text-main uppercase tracking-wide">Добавить запись</p>
        <div className="flex gap-2">
          <select className="neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
          <input className="flex-1 min-w-0 neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Сумма" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input className="w-[120px] neo-inset px-2 py-2 text-sm bg-white dark:bg-slate-800" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <input className="w-full neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder={type === 'income' ? 'Источник' : 'Куда'} value={source} onChange={(e) => setSource(e.target.value)} />
        <div className="flex gap-2">
          <input className="flex-1 neo-inset px-3 py-2 text-sm bg-white dark:bg-slate-800" placeholder="Категория" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button className="neo-accent px-5 rounded-lg text-lg" onClick={submit}>+</button>
        </div>
      </div>

      <FinanceChart entries={finances} year={year} />

      <div className="flex items-center justify-between mb-3 mt-6">
        <h2 className="font-bold text-sm text-main uppercase tracking-wide">Записи ({inPeriod.length})</h2>
        <button className="neo-btn text-xs px-3 py-1.5 font-bold text-green-600" onClick={() => exportCSV(inPeriod)}>⬇ CSV</button>
      </div>
      <div className="space-y-2">
        {inPeriod.length === 0 && <p className="text-muted text-sm text-center py-4">Записей нет</p>}
        {[...inPeriod].sort((a, b) => b.date.localeCompare(a.date)).map((f) => (
          <div key={f.id} className="flex items-center gap-3 p-3 neo-raised text-sm">
            <span className="text-[10px] font-bold text-muted w-12 shrink-0">{f.date.slice(5)}</span>
            <span className={`flex-1 font-medium truncate ${f.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{f.source}</span>
            <span className={`font-bold shrink-0 ${f.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {f.type === 'income' ? '+' : '−'}{f.amount.toLocaleString('ru-RU')}
            </span>
            <button className="text-muted hover:text-red-500 w-7 h-7 flex items-center justify-center neo-btn" onClick={() => deleteFinance(f.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
