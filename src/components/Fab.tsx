import { useLocation } from 'react-router-dom';

export default function Fab() {
  const { pathname } = useLocation();
  if (pathname === '/') return null; // Не показываем на календаре

  const target = ['/finance', '/ideas', '/dates', '/health', '/templates'].includes(pathname);
  if (!target) return null;

  const go = () => {
    const input = document.querySelector<HTMLInputElement>('input[placeholder]');
    input?.focus();
  };

  return (
    <button onClick={go}
      className="fixed bottom-28 right-4 z-40 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl shadow-lg hover:bg-blue-700">
      +
    </button>
  );
}
