import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useSpeech } from './useSpeech';

const DEBOUNCE_COUNT = 3;
const COOLDOWN_MS = 800;
const WINDOW_SIZE = 5;

export function usePrediction() {
  const consecutiveRef = useRef({ word: '', count: 0 });
  const lastAcceptedRef = useRef({ word: '', time: 0 });
  const windowRef = useRef<{ word: string; confidence: number }[]>([]);
  const {
    setPrediction, addToSentence, addHistoryMessage,
    updateMetrics, triggerGestureFlash, smoothingEnabled,
  } = useAppStore();
  const { speak } = useSpeech();

  const getMostFrequent = useCallback((window: { word: string; confidence: number }[]): string => {
    const scores: Record<string, number> = {};
    window.forEach(({ word, confidence }) => {
      scores[word] = (scores[word] || 0) + confidence;
    });
    let best = '';
    let bestScore = 0;
    for (const [w, s] of Object.entries(scores)) {
      if (s > bestScore) { best = w; bestScore = s; }
    }
    return best;
  }, []);

  const processPrediction = useCallback((word: string, confidence: number) => {
    const pred = { word, confidence, timestamp: Date.now() };
    setPrediction(pred);
    updateMetrics(pred);

    // Sliding window smoothing
    if (smoothingEnabled) {
      windowRef.current = [...windowRef.current.slice(-(WINDOW_SIZE - 1)), { word, confidence }];
      word = getMostFrequent(windowRef.current);
    }

    if (consecutiveRef.current.word === word) {
      consecutiveRef.current.count++;
    } else {
      consecutiveRef.current = { word, count: 1 };
    }

    if (consecutiveRef.current.count === DEBOUNCE_COUNT) {
      const now = Date.now();
      // Cooldown check
      if (lastAcceptedRef.current.word === word && now - lastAcceptedRef.current.time < COOLDOWN_MS) {
        consecutiveRef.current.count = 0;
        return;
      }

      addToSentence(word);
      speak(word);
      triggerGestureFlash();
      addHistoryMessage({
        id: crypto.randomUUID(),
        text: word,
        confidence,
        timestamp: now,
      });
      lastAcceptedRef.current = { word, time: now };
      consecutiveRef.current.count = 0;
    }
  }, [setPrediction, addToSentence, speak, addHistoryMessage, updateMetrics, triggerGestureFlash, smoothingEnabled, getMostFrequent]);

  const simulatePrediction = useCallback(() => {
    const words = ['Hello', 'Thank you', 'Yes', 'No', 'Please', 'Sorry', 'Help', 'Good', 'Bad', 'Love'];
    const word = words[Math.floor(Math.random() * words.length)];
    const confidence = 0.7 + Math.random() * 0.3;
    processPrediction(word, confidence);
  }, [processPrediction]);

  return { processPrediction, simulatePrediction };
}
