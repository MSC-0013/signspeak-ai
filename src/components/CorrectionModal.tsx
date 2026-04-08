import { memo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertTriangle } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1] as const;

function CorrectionModal() {
  const { showCorrectionModal, setShowCorrectionModal, currentPrediction, addCorrection } = useAppStore();
  const [corrected, setCorrected] = useState('');

  const handleSubmit = () => {
    if (!corrected.trim() || !currentPrediction) return;
    addCorrection(currentPrediction.word, corrected.trim());
    setCorrected('');
  };

  return (
    <AnimatePresence>
      {showCorrectionModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md"
          onClick={() => setShowCorrectionModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive/70" />
                <h3 className="text-sm font-semibold text-foreground">Correct Prediction</h3>
              </div>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="btn-ghost !h-7 !px-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-secondary/40">
              <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50 block mb-1">
                Model predicted:
              </span>
              <p className="text-xl font-bold text-foreground">
                {currentPrediction?.word || '—'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50 block mb-1.5">
                Correct gesture:
              </span>
              <input
                value={corrected}
                onChange={(e) => setCorrected(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type the correct word…"
                className="w-full bg-secondary/40 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none ring-1 ring-border/30 focus:ring-primary/40 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!corrected.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Correction
            </button>

            <p className="text-[10px] text-muted-foreground/35 text-center">
              This helps improve future predictions
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(CorrectionModal);
