import { Link } from 'react-router-dom';

export default function BottomNav() {

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pointer-events-none">
      <div className="flex justify-around items-end pb-5 pt-2 bg-gradient-to-t from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent">
        <Link to="/more" className="pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg bg-yellow-400 active:scale-95 transition-transform">
          📁
        </Link>
        <Link to="/" className="pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xl -mt-4 bg-red-500 ring-4 ring-red-200 dark:ring-red-900 active:scale-95 transition-transform">
          📅
        </Link>
        <Link to="/finance" className="pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg bg-green-400 active:scale-95 transition-transform">
          💰
        </Link>
      </div>
    </nav>
  );
}
