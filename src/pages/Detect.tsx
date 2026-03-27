import { motion } from 'framer-motion';
import CameraFeed from '@/components/CameraFeed';
import PredictionPanel from '@/components/PredictionPanel';
import ControlsBar from '@/components/ControlsBar';
import ConversationHistory from '@/components/ConversationHistory';
import ConfidenceChart from '@/components/ConfidenceChart';
import GesturePractice from '@/components/GesturePractice';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAppStore } from '@/store/useAppStore';
import { useState } from 'react';

type Tab = 'history' | 'practice';

export default function Detect() {
  useKeyboardShortcuts();
  const { showDebug } = useAppStore();
  const [tab, setTab] = useState<Tab>('history');

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">Detection Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Position your hands in front of the camera to begin translating
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-7 gap-5 mb-5">
          {/* Camera + Prediction */}
          <div className="lg:col-span-3">
            <CameraFeed />
          </div>
          <div className="lg:col-span-2 min-h-[300px]">
            <PredictionPanel />
          </div>

          {/* Right sidebar: tabs */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-[300px]">
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              {(['history', 'practice'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0">
              {tab === 'history' ? <ConversationHistory /> : <GesturePractice />}
            </div>
          </div>
        </div>

        {showDebug && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5"
          >
            <ConfidenceChart />
          </motion.div>
        )}

        <ControlsBar />
      </div>
    </div>
  );
}
