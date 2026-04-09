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

export interface SessionRecord {
  id: string;
  predictions: Prediction[];
  startTime: number;
  endTime: number;
}

export interface CorrectionEntry {
  id: string;
  original: string;
  corrected: string;
  timestamp: number;
}

interface AppState {
  // Camera
  isDetecting: boolean;
  cameraError: string | null;
  fps: number;
  showDebug: boolean;
  latency: number;

  // Predictions
  currentPrediction: Prediction | null;
  sentence: string[];
  predictionHistory: Prediction[];

  // Conversation history
  conversationHistory: HistoryMessage[];

  // Speech
  speechEnabled: boolean;
  language: string;
  isSpeaking: boolean;

  // Theme
  isDark: boolean;

  // Settings
  smoothingEnabled: boolean;
  keypointOverlayVisible: boolean;
  privacyMode: boolean;

  // Gestures
  customGestures: GestureMapping[];

  // Metrics
  metrics: SessionMetrics;

  // Gesture feedback flash
  gestureFlash: boolean;

  // Session recording
  isRecording: boolean;
  currentSession: Prediction[];
  sessionHistory: SessionRecord[];

  // Practice mode
  practiceMode: boolean;
  practiceTarget: string;
  practiceResult: 'idle' | 'success' | 'fail';

  // Corrections
  corrections: CorrectionEntry[];
  showCorrectionModal: boolean;

  // Actions
  setDetecting: (v: boolean) => void;
  setCameraError: (e: string | null) => void;
  setFps: (fps: number) => void;
  setLatency: (ms: number) => void;
  toggleDebug: () => void;
  setPrediction: (p: Prediction | null) => void;
  addToSentence: (word: string) => void;
  undoLastWord: () => void;
  addPunctuation: (p: string) => void;
  clearSentence: () => void;
  toggleSpeech: () => void;
  setLanguage: (lang: string) => void;
  setIsSpeaking: (v: boolean) => void;
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

  // Session recording
  startRecording: () => void;
  stopRecording: () => void;

  // Practice
  togglePracticeMode: () => void;
  setPracticeTarget: (word: string) => void;
  setPracticeResult: (r: 'idle' | 'success' | 'fail') => void;

  // Corrections
  addCorrection: (original: string, corrected: string) => void;
  setShowCorrectionModal: (v: boolean) => void;

  // Session ID for backend
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDetecting: false,
      cameraError: null,
      fps: 0,
      latency: 0,
      showDebug: false,
      currentPrediction: null,
      sentence: [],
      predictionHistory: [],
      conversationHistory: [],
      speechEnabled: true,
      language: 'en-US',
      isSpeaking: false,
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
      isRecording: false,
      currentSession: [],
      sessionHistory: [],
      practiceMode: false,
      practiceTarget: 'Hello',
      practiceResult: 'idle',
      corrections: [],
      showCorrectionModal: false,
      sessionId: null,

      setDetecting: (v) => set({ isDetecting: v }),
      setCameraError: (e) => set({ cameraError: e }),
      setFps: (fps) => set({ fps }),
      setLatency: (ms) => set({ latency: ms }),
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
      setIsSpeaking: (v) => set({ isSpeaking: v }),
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

      // Session recording
      startRecording: () => set({ isRecording: true, currentSession: [] }),
      stopRecording: () => set((s) => {
        if (s.currentSession.length === 0) return { isRecording: false };
        const record: SessionRecord = {
          id: crypto.randomUUID(),
          predictions: [...s.currentSession],
          startTime: s.currentSession[0]?.timestamp || Date.now(),
          endTime: Date.now(),
        };
        return {
          isRecording: false,
          sessionHistory: [...s.sessionHistory, record],
          currentSession: [],
        };
      }),

      // Practice
      togglePracticeMode: () => set((s) => ({ practiceMode: !s.practiceMode, practiceResult: 'idle' })),
      setPracticeTarget: (word) => set({ practiceTarget: word, practiceResult: 'idle' }),
      setPracticeResult: (r) => set({ practiceResult: r }),

      // Corrections
      addCorrection: (original, corrected) => set((s) => ({
        corrections: [...s.corrections, {
          id: crypto.randomUUID(),
          original,
          corrected,
          timestamp: Date.now(),
        }],
        showCorrectionModal: false,
      })),
      setShowCorrectionModal: (v) => set({ showCorrectionModal: v }),
      setSessionId: (id) => set({ sessionId: id }),
    }),
    {
      name: 'slrs-session-v1',
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
        corrections: state.corrections,
        sessionHistory: state.sessionHistory,
      }),
    }
  )
);
