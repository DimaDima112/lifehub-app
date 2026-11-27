export default function ProgressBar({ done, total }: { done: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-bold text-muted mb-1">
        <span>Выполнено сегодня</span>
        <span>{done} из {total}</span>
      </div>
      <div className="w-full h-3 neo-inset rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out" 
          style={{ width: `${percent}%` }} 
        />
      </div>
      {percent === 100 && total > 0 && (
        <p className="text-center text-xs text-green-500 font-bold mt-1 animate-bounce">🎉 Отличная работа!</p>
      )}
    </div>
  );
}
