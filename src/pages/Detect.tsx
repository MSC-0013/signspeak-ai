import { motion } from 'framer-motion';
import CameraFeed from '@/components/CameraFeed';
import PredictionDisplay from '@/components/PredictionDisplay';
import ConfidenceBar from '@/components/ConfidenceBar';
import StatusIndicator from '@/components/StatusIndicator';
import AppControls from '@/components/AppControls';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAppStore } from '@/store/useAppStore';

export default function Detect() {
  useKeyboardShortcuts();
  const { currentPrediction, isDetecting } = useAppStore();

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Detection Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Position your hands in front of the camera to begin
          </p>
        </motion.div>

        {/* Status */}
        <div className="flex justify-center mb-6">
          <StatusIndicator />
        </div>

        {/* Camera */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <CameraFeed />
        </motion.div>

        {/* Prediction + Confidence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-2xl mx-auto space-y-4 mb-8"
        >
          <PredictionDisplay prediction={currentPrediction} />
          <ConfidenceBar confidence={currentPrediction?.confidence ?? 0} />
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <AppControls />
        </motion.div>
      </div>
    </div>
  );
}
