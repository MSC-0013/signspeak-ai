import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useSpeech } from './useSpeech';

const DEBOUNCE_COUNT = 3;

export function usePrediction() {
  const consecutiveRef = useRef({ word: '', count: 0 });
  const { setPrediction, addToSentence } = useAppStore();
  const { speak } = useSpeech();

  const processPrediction = useCallback((word: string, confidence: number) => {
    const pred = { word, confidence, timestamp: Date.now() };
    setPrediction(pred);

    if (consecutiveRef.current.word === word) {
      consecutiveRef.current.count++;
    } else {
      consecutiveRef.current = { word, count: 1 };
    }

    if (consecutiveRef.current.count === DEBOUNCE_COUNT) {
      addToSentence(word);
      speak(word);
      consecutiveRef.current.count = 0;
    }
  }, [setPrediction, addToSentence, speak]);

  // Simulate predictions for demo
  const simulatePrediction = useCallback(() => {
    const words = ['Hello', 'Thank you', 'Yes', 'No', 'Please', 'Sorry', 'Help', 'Good', 'Bad', 'Love'];
    const word = words[Math.floor(Math.random() * words.length)];
    const confidence = 0.7 + Math.random() * 0.3;
    processPrediction(word, confidence);
  }, [processPrediction]);

  return { processPrediction, simulatePrediction };
}
