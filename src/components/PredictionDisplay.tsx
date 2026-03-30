import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

function PredictionDisplay() {
  const prediction = useAppStore((s) => s.currentPrediction);

  return (
    <div className="text-center py-6">
      <AnimatePresence mode="wait">
        {prediction ? (
          <motion.p
            key={prediction.word + prediction.timestamp}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl sm:text-6xl font-semibold tracking-tight text-foreground"
          >
            {prediction.word.toUpperCase()}
          </motion.p>
        ) : (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-lg text-muted-foreground font-light"
          >
            Waiting for gesture…
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(PredictionDisplay);
