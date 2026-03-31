import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Play, Square, RotateCcw } from 'lucide-react';
import CameraFeed from '@/components/CameraFeed';
import SentenceBuilder from '@/components/SentenceBuilder';
import TranslationPanel from '@/components/TranslationPanel';
import MetricsPanel from '@/components/MetricsPanel';
import SessionControls from '@/components/SessionControls';
import PracticePanel from '@/components/PracticePanel';
import CorrectionModal from '@/components/CorrectionModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const ease = [0.25, 0.1, 0.25, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function Detect() {
  useKeyboardShortcuts();
  const { isDetecting, setDetecting, clearSentence, resetSession } = useAppStore();

  return (
    <>
      <div className="min-h-screen pt-16 pb-8 px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto space-y-5"
        >
          {/* Page header */}
          <motion.div variants={item} className="text-center space-y-1 pt-4">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Sign Language Detection
            </h1>
            <p className="text-xs text-muted-foreground/60">
              Real-time AI communication interface
            </p>
          </motion.div>

          {/* Main controls */}
          <motion.div variants={item} className="flex items-center justify-center gap-3">
            <button
              onClick={() => setDetecting(!isDetecting)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isDetecting
                  ? 'bg-destructive/15 text-destructive hover:bg-destructive/25 ring-1 ring-destructive/20'
                  : 'bg-primary/15 text-primary hover:bg-primary/25 ring-1 ring-primary/20'
              }`}
            >
              {isDetecting ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isDetecting ? 'Stop Detection' : 'Start Detection'}
            </button>
            <button
              onClick={clearSentence}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary ring-1 ring-border/20 transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </motion.div>

          {/* Two-column layout */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* LEFT — Camera (3/5 width) */}
            <div className="lg:col-span-3">
              <CameraFeed />
            </div>

            {/* RIGHT — Sentence builder + translations (2/5 width) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex-1 min-h-[280px]">
                <SentenceBuilder />
              </div>
              <TranslationPanel />
            </div>
          </motion.div>

          {/* Bottom panels */}
          <motion.div variants={item}>
            <MetricsPanel />
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SessionControls />
            <PracticePanel />
          </motion.div>
        </motion.div>
      </div>

      <CorrectionModal />
    </>
  );
}
