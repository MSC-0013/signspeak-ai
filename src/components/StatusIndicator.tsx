import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';

function StatusIndicator() {
  const isDetecting = useAppStore((s) => s.isDetecting);
  const hasPrediction = useAppStore((s) => !!s.currentPrediction);

  const label = !isDetecting ? 'Ready' : hasPrediction ? 'Recognized' : 'Detecting…';

  return (
    <motion.div
      layout
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/50 bg-card/50"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
          !isDetecting
            ? 'bg-muted-foreground/50'
            : hasPrediction
              ? 'bg-primary'
              : 'bg-primary/60 animate-pulse'
        }`}
      />
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </motion.div>
  );
}

export default memo(StatusIndicator);
