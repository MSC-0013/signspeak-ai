import { memo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

function ConfidenceBar() {
  const confidence = useAppStore((s) => s.currentPrediction?.confidence ?? 0);
  const pct = Math.round(confidence * 100);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-border/50 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary/70"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground tabular-nums w-10 text-right">
        {pct}%
      </span>
    </div>
  );
}

export default memo(ConfidenceBar);
