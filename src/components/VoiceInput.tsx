import { useState, useEffect } from 'react';

export default function VoiceInput({ onResult }: { onResult: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'ru-RU';
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResult(text);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, [onResult]);

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  if (!recognition) return null;

  return (
    <button 
      type="button" 
      onClick={toggleListen} 
      className={`w-10 h-10 flex items-center justify-center neo-btn rounded-lg shrink-0 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted'}`}
      title="Голосовой ввод"
    >
      🎤
    </button>
  );
}
