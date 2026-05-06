import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGN_CATALOG } from '@/utils/gestureClassifier';
import type { DetectionState } from '@/utils/signValidator';

interface Props {
  sign: string | null;
  confidence: number;
  state: DetectionState;
}

function SignFeedback({ sign, confidence, state }: Props) {
  if (!sign || state === 'UNCLEAR') return null;

  const info = SIGN_CATALOG[sign];
  const emoji = info?.emoji || '❓';
  const confColor = confidence >= 0.85 ? 'bg-emerald-400' : confidence >= 0.7 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <AnimatePresence>
      <motion.div
        key={sign}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="glass-card rounded-2xl p-4 flex items-center gap-4"
      >
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-foreground">{sign.replace(/_/g, ' ')}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${confColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${confidence * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <span className={`text-[10px] font-medium mt-1 inline-block ${state === 'CONFIRMED' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {state === 'CONFIRMED' ? '✓ Confirmed' : '◉ Detecting…'}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(SignFeedback);