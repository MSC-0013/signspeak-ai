import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Play, Square, RotateCcw, Info } from 'lucide-react';
import CameraFeed from '@/components/CameraFeed';
import SentenceBuilder from '@/components/SentenceBuilder';
import TranslationPanel from '@/components/TranslationPanel';
import MetricsPanel from '@/components/MetricsPanel';
import SessionControls from '@/components/SessionControls';
import PracticePanel from '@/components/PracticePanel';
import ConversationHistory from '@/components/ConversationHistory';
import CorrectionModal from '@/components/CorrectionModal';
import OnboardingModal from '@/components/OnboardingModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const ease = [0.25, 0.1, 0.25, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function Detect() {
  useKeyboardShortcuts();
  const { isDetecting, setDetecting, clearSentence, resetSession } = useAppStore();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('slrs-onboarded');
  });

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('slrs-onboarded', '1');
    setShowOnboarding(false);
    setDetecting(true);
  }, [setDetecting]);

  return (
    <>
      <div className="min-h-screen pt-16 pb-8 px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-[1400px] mx-auto space-y-5"
        >
          {/* Page header */}
          <motion.div variants={item} className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Sign Language Detection
              </h1>
              <p className="text-xs text-muted-foreground/50">
                Real-time AI communication interface
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOnboarding(true)}
                className="btn-ghost"
              >
                <Info className="w-3.5 h-3.5" />
                Guide
              </button>
              <button
                onClick={() => { clearSentence(); resetSession(); }}
                className="btn-ghost"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
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

          {/* Main layout: Camera + Sidebar */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT — Camera (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <CameraFeed />
              <MetricsPanel />
            </div>

            {/* RIGHT — Tools (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex-1 min-h-[300px]">
                <SentenceBuilder />
              </div>
              <TranslationPanel />
              <ConversationHistory />
            </div>
          </motion.div>

          {/* Bottom panels */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SessionControls />
            <PracticePanel />
          </motion.div>
        </motion.div>
      </div>

      <CorrectionModal />
      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
}
