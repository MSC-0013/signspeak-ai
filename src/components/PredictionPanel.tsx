import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, TrendingUp, Undo2, Type } from 'lucide-react';

function PredictionPanel() {
  const { currentPrediction, sentence, undoLastWord, addPunctuation } = useAppStore();

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Current prediction */}
      <div className="glass rounded-2xl p-5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current Detection
          </span>
        </div>
        <AnimatePresence mode="wait">
          {currentPrediction ? (
            <motion.div
              key={currentPrediction.word + currentPrediction.timestamp}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-3xl font-bold text-foreground mb-3">
                {currentPrediction.word}
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono font-semibold text-primary">
                    {(currentPrediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentPrediction.confidence * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-sm"
            >
              Waiting for detection...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Sentence builder */}
      <div className="glass rounded-2xl p-5 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Translated Sentence
            </span>
          </div>
          {sentence.length > 0 && (
            <div className="flex items-center gap-1">
              {['.', ',', '?', '!'].map((p) => (
                <button
                  key={p}
                  onClick={() => addPunctuation(p)}
                  className="w-7 h-7 rounded-lg text-xs font-mono bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity flex items-center justify-center"
                  aria-label={`Add ${p}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={undoLastWord}
                className="w-7 h-7 rounded-lg bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity flex items-center justify-center ml-1"
                aria-label="Undo last word"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {sentence.length > 0 ? (
            <p className="text-lg leading-relaxed text-foreground">
              {sentence.join(' ')}
              <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse align-middle" />
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Detected words will appear here as a sentence...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(PredictionPanel);
