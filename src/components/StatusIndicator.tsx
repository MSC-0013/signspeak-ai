import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';

function StatusIndicator() {
  const { isDetecting, currentPrediction } = useAppStore();

  const status = !isDetecting
    ? { label: 'Idle', color: 'bg-muted-foreground' }
    : currentPrediction
      ? { label: 'Result', color: 'bg-primary' }
      : { label: 'Detecting...', color: 'bg-accent' };

  return (
    <motion.div
      layout
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50"
    >
      <span className={`w-2 h-2 rounded-full ${status.color} ${isDetecting ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-medium text-muted-foreground">{status.label}</span>
    </motion.div>
  );
}

export default memo(StatusIndicator);
