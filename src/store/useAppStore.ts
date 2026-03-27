import { create } from 'zustand';

interface Prediction {
  word: string;
  confidence: number;
  timestamp: number;
}

interface AppState {
  // Camera
  isDetecting: boolean;
  cameraError: string | null;
  fps: number;
  showDebug: boolean;

  // Predictions
  currentPrediction: Prediction | null;
  sentence: string[];
  predictionHistory: Prediction[];

  // Speech
  speechEnabled: boolean;
  language: string;

  // Theme
  isDark: boolean;

  // Actions
  setDetecting: (v: boolean) => void;
  setCameraError: (e: string | null) => void;
  setFps: (fps: number) => void;
  toggleDebug: () => void;
  setPrediction: (p: Prediction | null) => void;
  addToSentence: (word: string) => void;
  clearSentence: () => void;
  toggleSpeech: () => void;
  setLanguage: (lang: string) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDetecting: false,
  cameraError: null,
  fps: 0,
  showDebug: false,
  currentPrediction: null,
  sentence: [],
  predictionHistory: [],
  speechEnabled: true,
  language: 'en-US',
  isDark: true,

  setDetecting: (v) => set({ isDetecting: v }),
  setCameraError: (e) => set({ cameraError: e }),
  setFps: (fps) => set({ fps }),
  toggleDebug: () => set((s) => ({ showDebug: !s.showDebug })),
  setPrediction: (p) => set((s) => ({
    currentPrediction: p,
    predictionHistory: p ? [...s.predictionHistory.slice(-49), p] : s.predictionHistory,
  })),
  addToSentence: (word) => set((s) => ({ sentence: [...s.sentence, word] })),
  clearSentence: () => set({ sentence: [], predictionHistory: [] }),
  toggleSpeech: () => set((s) => ({ speechEnabled: !s.speechEnabled })),
  setLanguage: (lang) => set({ language: lang }),
  toggleTheme: () => set((s) => {
    const next = !s.isDark;
    document.documentElement.classList.toggle('dark', next);
    return { isDark: next };
  }),
}));
