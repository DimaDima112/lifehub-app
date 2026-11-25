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
    <div className="p-3">
      <h1 className="text-xl font-bold mb-3">Финансы</h1>

      <div className="flex gap-1 mb-3 text-sm">
        {(['day', 'month', 'year'] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 px-2 py-1.5 rounded-lg ${period === p ? 'bg-gray-800 text-white' : 'bg-gray-200 dark:bg-slate-700'}`}>
            {p === 'day' ? 'День' : p === 'month' ? 'Месяц' : 'Год'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <div className="bg-green-100 border border-green-400 rounded-lg p-2 text-center">
          <p className="text-[10px] text-green-700">Доход</p>
          <p className="font-bold text-green-700 text-xs leading-tight break-all">{fmtMoney(income)}</p>
        </div>
        <div className="bg-red-100 border border-red-400 rounded-lg p-2 text-center">
          <p className="text-[10px] text-red-700">Расход</p>
          <p className="font-bold text-red-700 text-xs leading-tight break-all">{fmtMoney(expense)}</p>
        </div>
        <div className={`${balance >= 0 ? 'bg-blue-100 border-blue-400' : 'bg-orange-100 border-orange-400'} border rounded-lg p-2 text-center`}>
          <p className="text-[10px]">Баланс</p>
          <p className="font-bold text-xs leading-tight break-all">{fmtMoney(balance)}</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-3 border rounded-lg p-2 bg-gray-50 dark:bg-slate-800">
        <div className="flex gap-1.5">
          <select className="border rounded-lg px-2 py-1.5 text-sm" value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
          <input className="flex-1 border rounded-lg px-2 py-1.5 text-sm min-w-0" placeholder="Сумма" type="number" value={amount}
            onChange={(e) => setAmount(e.target.value)} />
        </div>
        <input className="w-full border rounded-lg px-2 py-1.5 text-sm" type="date" value={date}
          onChange={(e) => setDate(e.target.value)} />
        <input className="w-full border rounded-lg px-2 py-1.5 text-sm"
          placeholder={type === 'income' ? 'Источник' : 'Куда'}
          value={source} onChange={(e) => setSource(e.target.value)} />
        <div className="flex gap-1.5">
          <input className="flex-1 border rounded-lg px-2 py-1.5 text-sm min-w-0" placeholder="Категория"
            value={category} onChange={(e) => setCategory(e.target.value)} />
          <button className="bg-blue-600 text-white px-4 rounded-lg text-sm" onClick={submit}>+</button>
        </div>
      </div>

      <FinanceChart entries={finances} year={year} />

      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-sm">Записи ({inPeriod.length})</h2>
        <button className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg"
          onClick={() => exportCSV(inPeriod)}>⬇ CSV</button>
      </div>
      <div className="space-y-1">
        {inPeriod.length === 0 && <p className="text-gray-500 text-sm text-center py-3">Записей нет</p>}
        {[...inPeriod].sort((a, b) => b.date.localeCompare(a.date)).map((f) => (
          <div key={f.id} className="flex items-center gap-1.5 p-2 border rounded-lg text-xs">
            <span className="text-gray-500 shrink-0">{f.date.slice(5)}</span>
            <span className={`shrink-0 ${f.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
              {f.type === 'income' ? '+' : '−'}
            </span>
            <span className="flex-1 truncate">{f.source}</span>
            <span className={`font-semibold shrink-0 ${f.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
              {f.amount.toLocaleString('ru-RU')}
            </span>
            <button className="text-red-600 shrink-0" onClick={() => deleteFinance(f.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
