import { memo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          onClick={() => setShowCorrectionModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl p-6 w-full max-w-sm mx-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Correct Prediction</h3>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-1">
                Model predicted:
              </span>
              <p className="text-lg font-bold text-foreground">
                {currentPrediction?.word || '—'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 block mb-1.5">
                Correct gesture:
              </span>
              <input
                value={corrected}
                onChange={(e) => setCorrected(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type the correct word..."
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:ring-1 focus:ring-primary/40 transition-all"
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

            <p className="text-[10px] text-muted-foreground/40 text-center">
              This helps improve future predictions
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(CorrectionModal);
