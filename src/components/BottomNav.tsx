import { useLocation, Link } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  const isMore = pathname === '/more';
  const isFinance = pathname === '/finance';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pointer-events-none">
      <div className="flex justify-around items-end pb-4 pt-2 bg-gradient-to-t from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent">
        
        {/* Жёлтая кнопка -> Ещё */}
        <Link to="/more" className={`pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md transition-transform active:scale-95 ${isMore ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600 dark:bg-slate-800 dark:text-amber-500'}`}>
          📁
        </Link>

        {/* Центральная кнопка -> Главная */}
        <Link to="/" className={`pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg -mt-3 transition-transform active:scale-95 ${isHome ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900' : 'bg-white dark:bg-slate-800 text-blue-600 border border-gray-100 dark:border-slate-700'}`}>
          📅
        </Link>

        {/* Зелёная кнопка -> Финансы */}
        <Link to="/finance" className={`pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md transition-transform active:scale-95 ${isFinance ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 dark:bg-slate-800 dark:text-emerald-500'}`}>
          💰
        </Link>
        
      </div>
    </nav>
  );
}
