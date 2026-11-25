import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [prompt, setPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setPrompt(null);
    });
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setPrompt(null);
  };

  if (installed) {
    return <p className="text-xs text-green-600">✅ Приложение установлено</p>;
  }

  if (!prompt) {
    return (
      <p className="text-xs text-gray-500">
        Откройте сайт в Chrome/Safari и добавьте на главный экран через меню браузера.
        {window.matchMedia('(display-mode: standalone)').matches && ' Приложение уже запущено как PWA.'}
      </p>
    );
  }

  return (
    <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm" onClick={install}>
      📲 Установить на главный экран
    </button>
  );
}
