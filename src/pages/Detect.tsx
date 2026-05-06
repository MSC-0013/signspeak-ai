import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Play, Square, RotateCcw, Info } from 'lucide-react';
import CameraFeed from '@/components/CameraFeed';
import type { DetectionInfo } from '@/components/CameraFeed';
import RealtimeTranscript from '@/components/RealtimeTranscript';
import MetricsDashboard from '@/components/MetricsDashboard';
import QuickSignBar from '@/components/QuickSignBar';
import GestureGuide from '@/components/GestureGuide';
import SignFeedback from '@/components/SignFeedback';
import OnboardingModal from '@/components/OnboardingModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSpeech } from '@/hooks/useSpeech';
import { SIGN_CATALOG } from '@/utils/gestureClassifier';
import type { DetectionState } from '@/utils/signValidator';

const ease = [0.25, 0.1, 0.25, 1] as const;
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

export default function Detect() {
  useKeyboardShortcuts();
  const { speak } = useSpeech();
  const { isDetecting, setDetecting, clearSentence, resetSession, addToSentence, setPrediction, updateMetrics, triggerGestureFlash, speechEnabled } = useAppStore();
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('slrs-onboarded'));
  const [currentDetection, setCurrentDetection] = useState<{ sign: string; confidence: number; state: DetectionState } | null>(null);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('slrs-onboarded', '1');
    setShowOnboarding(false);
    setDetecting(true);
  }, [setDetecting]);

  const handleDetection = useCallback((info: DetectionInfo) => {
    const { sign, confidence, state, emoji } = info;

    if (sign === 'NO_HAND' || sign === 'LOADING' || sign === 'ERROR') {
      setCurrentDetection(null);
      return;
    }

    setPrediction({ word: sign, confidence, timestamp: Date.now() });
    updateMetrics({ word: sign, confidence, timestamp: Date.now() });

    if (sign !== 'UNCLEAR') {
      setCurrentDetection({ sign, confidence, state });
    } else {
      setCurrentDetection(null);
    }

    if (state === 'CONFIRMED') {
      const label = SIGN_CATALOG[sign]?.label || sign.replace(/_/g, ' ');
      addToSentence(label);
      triggerGestureFlash();
      if (speechEnabled) speak(label);
    }
  }, [setPrediction, updateMetrics, addToSentence, triggerGestureFlash, speechEnabled, speak]);

  return (
    <>
      <div className="min-h-screen pt-12 pb-5 px-4">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[1320px] mx-auto space-y-3">
          {/* Header */}
          <motion.div variants={item} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold text-foreground tracking-tight">Sign Language Detection</h1>
              <p className="text-xs text-muted-foreground/50">Real-time AI communication • {Object.keys(SIGN_CATALOG).length} signs supported</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowOnboarding(true)} className="btn-ghost"><Info className="w-3.5 h-3.5" />Guide</button>
              <button onClick={() => { clearSentence(); resetSession(); }} className="btn-ghost"><RotateCcw className="w-3.5 h-3.5" />Reset</button>
              <button
                onClick={() => setDetecting(!isDetecting)}
                className={`h-9 px-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isDetecting
                    ? 'bg-destructive/15 text-destructive hover:bg-destructive/25 ring-1 ring-destructive/20'
                    : 'bg-primary text-primary-foreground hover:opacity-90 glow-soft'
                }`}
              >
                {isDetecting ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isDetecting ? 'Stop' : 'Start Detection'}
              </button>
            </div>
          </motion.div>

          {/* 60/40 Grid */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-5 gap-3 items-start">
            {/* LEFT — Camera 60% */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              {/* Camera */}
              <div className="flex-shrink-0">
                <CameraFeed onDetection={handleDetection} />
              </div>

              {/* Metrics + Quick Signs */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <MetricsDashboard />
                <QuickSignBar />
              </div>

              {/* Guide */}
              <GestureGuide />
            </div>

            {/* RIGHT — Tools 40% */}
            <div className="lg:col-span-2 flex flex-col gap-3 h-full">
              <SignFeedback
                sign={currentDetection?.sign || null}
                confidence={currentDetection?.confidence || 0}
                state={currentDetection?.state || 'UNCLEAR'}
              />
              <div className="flex-1 min-h-0">
                <RealtimeTranscript />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
}
