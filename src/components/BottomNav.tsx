import { useLocation, Link } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  const isMore = pathname === '/more';
  const isFinance = pathname === '/finance';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pointer-events-none">
      <div className="flex justify-around items-end pb-5 pt-3 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/90 to-transparent">
        
        <Link to="/more" className={`pointer-events-auto w-14 h-14 rounded-2xl flex items-center justify-center text-xl neo-raised transition-all active:scale-95 ${isMore ? 'border-amber-400 text-amber-500' : ''}`}>
          📁
        </Link>

        <Link to="/" className={`pointer-events-auto w-16 h-16 rounded-[20px] flex items-center justify-center text-2xl neo-primary transition-all active:scale-95 ${isHome ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-[var(--bg-main)]' : ''}`}>
          📅
        </Link>

        <Link to="/finance" className={`pointer-events-auto w-14 h-14 rounded-2xl flex items-center justify-center text-xl neo-raised transition-all active:scale-95 ${isFinance ? 'border-emerald-400 text-emerald-500' : ''}`}>
          💰
        </Link>
        
      </div>
    </nav>
  );
}
