import { useLocation, Link } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isMore = pathname === '/more';
  const isFinance = pathname === '/finance';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pointer-events-none">
      <div className="flex justify-around items-end pb-6 pt-4 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/95 to-transparent">
        
        <Link to="/more" className={`pointer-events-auto w-14 h-14 rounded-2xl flex items-center justify-center text-xl neo-btn transition-all active:scale-95 ${isMore ? 'bg-[var(--bg-inset)] shadow-none' : ''}`}>
          📁
        </Link>

        <Link to="/" className={`pointer-events-auto w-16 h-16 rounded-[20px] flex items-center justify-center text-2xl neo-primary transition-all active:scale-95 ${isHome ? 'ring-2 ring-[var(--text-main)] ring-offset-2 ring-offset-[var(--bg-base)]' : ''}`}>
          📅
        </Link>

        <Link to="/finance" className={`pointer-events-auto w-14 h-14 rounded-2xl flex items-center justify-center text-xl neo-btn transition-all active:scale-95 ${isFinance ? 'bg-[var(--bg-inset)] shadow-none' : ''}`}>
          💰
        </Link>
        
      </div>
    </nav>
  );
}
