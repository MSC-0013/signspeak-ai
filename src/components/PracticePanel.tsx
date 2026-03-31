import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

const PRACTICE_WORDS = ['Hello', 'Thank you', 'Yes', 'No', 'Please', 'Sorry', 'Help', 'Good', 'Love'];

function PracticePanel() {
  const { practiceMode, togglePracticeMode, practiceTarget, setPracticeTarget, practiceResult } = useAppStore();

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Practice Mode
          </span>
        </div>
        <button
          onClick={togglePracticeMode}
          className={`h-6 w-10 rounded-full transition-colors relative ${
            practiceMode ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          <motion.div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-foreground"
            animate={{ left: practiceMode ? 18 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {practiceMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Target word */}
            <div className="text-center py-3">
              <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider block mb-1">
                Sign this word:
              </span>
              <p className="text-3xl font-bold text-foreground">{practiceTarget}</p>
            </div>

            {/* Result feedback */}
            {practiceResult !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl mb-3 text-sm font-medium ${
                  practiceResult === 'success'
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {practiceResult === 'success' ? (
                  <><CheckCircle2 className="w-4 h-4" /> Correct!</>
                ) : (
                  <><XCircle className="w-4 h-4" /> Try again</>
                )}
              </motion.div>
            )}

            {/* Word selector */}
            <div className="flex flex-wrap gap-1.5">
              {PRACTICE_WORDS.map((w) => (
                <button
                  key={w}
                  onClick={() => setPracticeTarget(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    practiceTarget === w
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-secondary text-secondary-foreground hover:opacity-80'
                  }`}
                >
                  {w}
                </button>
              ))}
              <button
                onClick={() => {
                  const rand = PRACTICE_WORDS[Math.floor(Math.random() * PRACTICE_WORDS.length)];
                  setPracticeTarget(rand);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary text-muted-foreground hover:opacity-80 transition-opacity"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(PracticePanel);
