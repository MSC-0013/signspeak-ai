import { motion } from 'framer-motion';
import CameraFeed from '@/components/CameraFeed';
import PredictionDisplay from '@/components/PredictionDisplay';
import ConfidenceBar from '@/components/ConfidenceBar';
import StatusIndicator from '@/components/StatusIndicator';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Detect() {
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl flex flex-col items-center gap-6"
      >
        {/* Status */}
        <motion.div variants={item}>
          <StatusIndicator />
        </motion.div>

        {/* Camera — 16:9 full width */}
        <motion.div variants={item} className="w-full">
          <CameraFeed />
        </motion.div>

        {/* Prediction */}
        <motion.div variants={item} className="w-full">
          <PredictionDisplay />
        </motion.div>

        {/* Confidence */}
        <motion.div variants={item} className="w-full max-w-md">
          <ConfidenceBar />
        </motion.div>
      </motion.div>
    </div>
  );
}
