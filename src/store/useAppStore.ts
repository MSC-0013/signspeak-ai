import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Prediction {
  word: string;
  confidence: number;
  timestamp: number;
}

export interface HistoryMessage {
  id: string;
  text: string;
  confidence: number;
  timestamp: number;
}

export interface GestureMapping {
  id: string;
  gestureId: string;
  label: string;
}

export interface SessionMetrics {
  totalPredictions: number;
  avgConfidence: number;
  sessionStart: number;
  sessionDuration: number;
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

  // Conversation history
  conversationHistory: HistoryMessage[];

  // Speech
  speechEnabled: boolean;
  language: string;

  // Theme
  isDark: boolean;

  // Settings / feature toggles
  smoothingEnabled: boolean;
  keypointOverlayVisible: boolean;
  privacyMode: boolean;

  // Gestures
  customGestures: GestureMapping[];

  // Metrics
  metrics: SessionMetrics;

  // Gesture feedback flash
  gestureFlash: boolean;

  // Actions
  setDetecting: (v: boolean) => void;
  setCameraError: (e: string | null) => void;
  setFps: (fps: number) => void;
  toggleDebug: () => void;
  setPrediction: (p: Prediction | null) => void;
  addToSentence: (word: string) => void;
  undoLastWord: () => void;
  addPunctuation: (p: string) => void;
  clearSentence: () => void;
  toggleSpeech: () => void;
  setLanguage: (lang: string) => void;
  toggleTheme: () => void;
  toggleSmoothing: () => void;
  toggleKeypointOverlay: () => void;
  togglePrivacyMode: () => void;
  addHistoryMessage: (msg: HistoryMessage) => void;
  clearHistory: () => void;
  addGesture: (g: GestureMapping) => void;
  removeGesture: (id: string) => void;
  updateMetrics: (prediction: Prediction) => void;
  resetSession: () => void;
  triggerGestureFlash: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDetecting: false,
      cameraError: null,
      fps: 0,
      showDebug: false,
      currentPrediction: null,
      sentence: [],
      predictionHistory: [],
      conversationHistory: [],
      speechEnabled: true,
      language: 'en-US',
      isDark: true,
      smoothingEnabled: true,
      keypointOverlayVisible: true,
      privacyMode: false,
      customGestures: [],
      metrics: {
        totalPredictions: 0,
        avgConfidence: 0,
        sessionStart: Date.now(),
        sessionDuration: 0,
      },
      gestureFlash: false,

      setDetecting: (v) => set({ isDetecting: v }),
      setCameraError: (e) => set({ cameraError: e }),
      setFps: (fps) => set({ fps }),
      toggleDebug: () => set((s) => ({ showDebug: !s.showDebug })),
      setPrediction: (p) => set((s) => ({
        currentPrediction: p,
        predictionHistory: p ? [...s.predictionHistory.slice(-49), p] : s.predictionHistory,
      })),
      addToSentence: (word) => set((s) => {
        const isFirst = s.sentence.length === 0;
        const capitalized = isFirst ? word.charAt(0).toUpperCase() + word.slice(1) : word;
        return { sentence: [...s.sentence, capitalized] };
      }),
      undoLastWord: () => set((s) => ({ sentence: s.sentence.slice(0, -1) })),
      addPunctuation: (p) => set((s) => {
        if (s.sentence.length === 0) return s;
        const updated = [...s.sentence];
        updated[updated.length - 1] = updated[updated.length - 1] + p;
        return { sentence: updated };
      }),
      clearSentence: () => set({ sentence: [], predictionHistory: [], currentPrediction: null }),
      toggleSpeech: () => set((s) => ({ speechEnabled: !s.speechEnabled })),
      setLanguage: (lang) => set({ language: lang }),
      toggleTheme: () => set((s) => {
        const next = !s.isDark;
        document.documentElement.classList.toggle('dark', next);
        return { isDark: next };
      }),
      toggleSmoothing: () => set((s) => ({ smoothingEnabled: !s.smoothingEnabled })),
      toggleKeypointOverlay: () => set((s) => ({ keypointOverlayVisible: !s.keypointOverlayVisible })),
      togglePrivacyMode: () => set((s) => ({ privacyMode: !s.privacyMode })),
      addHistoryMessage: (msg) => set((s) => {
        if (s.privacyMode) return s;
        return { conversationHistory: [...s.conversationHistory, msg] };
      }),
      clearHistory: () => set({ conversationHistory: [] }),
      addGesture: (g) => set((s) => ({ customGestures: [...s.customGestures, g] })),
      removeGesture: (id) => set((s) => ({
        customGestures: s.customGestures.filter((g) => g.id !== id),
      })),
      updateMetrics: (prediction) => set((s) => {
        const total = s.metrics.totalPredictions + 1;
        const avg = (s.metrics.avgConfidence * s.metrics.totalPredictions + prediction.confidence) / total;
        return {
          metrics: {
            ...s.metrics,
            totalPredictions: total,
            avgConfidence: avg,
            sessionDuration: Date.now() - s.metrics.sessionStart,
          },
        };
      }),
      resetSession: () => set({
        sentence: [],
        predictionHistory: [],
        currentPrediction: null,
        conversationHistory: [],
        metrics: {
          totalPredictions: 0,
          avgConfidence: 0,
          sessionStart: Date.now(),
          sessionDuration: 0,
        },
      }),
      triggerGestureFlash: () => {
        set({ gestureFlash: true });
        setTimeout(() => set({ gestureFlash: false }), 300);
      },
    }),
    {
      name: 'slrs-session-v1',
      partials: ['sentence', 'conversationHistory', 'speechEnabled', 'language', 'isDark', 'smoothingEnabled', 'keypointOverlayVisible', 'privacyMode', 'customGestures', 'metrics'] as any,
      partialize: (state) => ({
        sentence: state.privacyMode ? [] : state.sentence,
        conversationHistory: state.privacyMode ? [] : state.conversationHistory,
        speechEnabled: state.speechEnabled,
        language: state.language,
        isDark: state.isDark,
        smoothingEnabled: state.smoothingEnabled,
        keypointOverlayVisible: state.keypointOverlayVisible,
        privacyMode: state.privacyMode,
        customGestures: state.customGestures,
        metrics: state.metrics,
      }),
    }
  )
);
