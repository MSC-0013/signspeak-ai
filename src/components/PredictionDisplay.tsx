import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Prediction } from '@/store/useAppStore';

interface Props {
  prediction: Prediction | null;
}

function PredictionDisplay({ prediction }: Props) {
  return (
    <div className="glass rounded-2xl p-8 text-center min-h-[140px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {prediction ? (
          <motion.div
            key={prediction.word + prediction.timestamp}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight">
              {prediction.word.toUpperCase()}
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-lg"
          >
            Waiting for detection…
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(PredictionDisplay);
