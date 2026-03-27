import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useSpeech } from './useSpeech';

export function useKeyboardShortcuts() {
  const { isDetecting, setDetecting, undoLastWord, clearSentence, sentence } = useAppStore();
  const { speak } = useSpeech();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setDetecting(!isDetecting);
          break;
        case 'Enter':
          e.preventDefault();
          if (sentence.length > 0) speak(sentence.join(' '));
          break;
        case 'Backspace':
          e.preventDefault();
          undoLastWord();
          break;
        case 'KeyC':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            clearSentence();
          }
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDetecting, setDetecting, undoLastWord, clearSentence, sentence, speak]);
}
