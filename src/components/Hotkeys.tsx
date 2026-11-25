import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hotkeys() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); navigate('/planner'); }
      if (e.key === 'h' || e.key === 'H') navigate('/');
      if (e.key === 'f' || e.key === 'F') navigate('/finance');
      if (e.key === 'd' || e.key === 'D') navigate('/planner');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  return null;
}
