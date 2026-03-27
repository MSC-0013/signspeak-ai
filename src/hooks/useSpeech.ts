import { useCallback, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useSpeech() {
  const lastSpoken = useRef('');
  const { speechEnabled, language } = useAppStore();

  const speak = useCallback((text: string) => {
    if (!speechEnabled || !text || text === lastSpoken.current) return;
    if (!('speechSynthesis' in window)) return;

    lastSpoken.current = text;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [speechEnabled, language]);

  return { speak };
}
