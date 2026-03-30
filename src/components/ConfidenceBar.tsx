import { memo } from 'react';
import { motion } from 'framer-motion';

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 90 ? 'bg-primary' : pct >= 70 ? 'bg-accent' : 'bg-destructive';

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Confidence
        </span>
        <span className="text-sm font-mono font-semibold text-foreground">{pct}%</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default memo(ConfidenceBar);
