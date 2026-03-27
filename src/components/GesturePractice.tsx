import { memo, useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const PRACTICE_WORDS = ['Hello', 'Thank you', 'Yes', 'No', 'Please', 'Sorry', 'Help', 'Good', 'Love'];

function GesturePractice() {
  const { currentPrediction } = useAppStore();
  const [target, setTarget] = useState(() => PRACTICE_WORDS[Math.floor(Math.random() * PRACTICE_WORDS.length)]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const nextTarget = useCallback(() => {
    setTarget(PRACTICE_WORDS[Math.floor(Math.random() * PRACTICE_WORDS.length)]);
    setResult(null);
  }, []);

  const checkMatch = useCallback(() => {
    if (!currentPrediction) return;
    const match = currentPrediction.word.toLowerCase() === target.toLowerCase();
    setResult(match ? 'correct' : 'wrong');
    setScore((s) => ({ correct: s.correct + (match ? 1 : 0), total: s.total + 1 }));
    setTimeout(nextTarget, 1500);
  }, [currentPrediction, target, nextTarget]);

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Practice Mode</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {score.correct}/{score.total}
        </span>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground mb-2">Show this sign:</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={target}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-3xl font-bold text-foreground"
          >
            {target}
          </motion.p>
        </AnimatePresence>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-center gap-2 mt-3 ${result === 'correct' ? 'text-primary' : 'text-destructive'}`}
          >
            {result === 'correct' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{result === 'correct' ? 'Correct!' : 'Try again'}</span>
          </motion.div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={checkMatch}
          className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Check
        </button>
        <button
          onClick={nextTarget}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Next word"
        >
          <RotateCcw className="w-4 h-4 text-secondary-foreground" />
        </button>
      </div>
    </div>
  );
}

export default memo(GesturePractice);
