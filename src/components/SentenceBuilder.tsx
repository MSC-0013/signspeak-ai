import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Undo2, Trash2, Volume2, AlertCircle } from 'lucide-react';

function SentenceBuilder() {
  const {
    sentence, currentPrediction, undoLastWord, clearSentence,
    isSpeaking, setIsSpeaking, setShowCorrectionModal,
  } = useAppStore();

  const speakSentence = () => {
    if (sentence.length === 0 || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence.join(' '));
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass rounded-2xl p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sentence Builder
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowCorrectionModal(true)}
            disabled={!currentPrediction}
            className="h-7 px-2.5 rounded-lg text-xs font-medium bg-destructive/10 text-destructive/80 hover:bg-destructive/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            Wrong?
          </button>
        </div>
      </div>

      {/* Current detection */}
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 block">
          Current Detection
        </span>
        <AnimatePresence mode="wait">
          {currentPrediction ? (
            <motion.p
              key={currentPrediction.word + currentPrediction.timestamp}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-2xl font-bold text-foreground"
            >
              {currentPrediction.word}
            </motion.p>
          ) : (
            <p className="text-sm text-muted-foreground/40 italic">Waiting...</p>
          )}
        </AnimatePresence>
      </div>

      {/* Sentence display */}
      <div className="flex-1 min-h-0 mb-4 overflow-y-auto">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 block">
          Built Sentence
        </span>
        {sentence.length > 0 ? (
          <p className="text-lg leading-relaxed text-foreground">
            {sentence.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline"
              >
                {i > 0 ? ' ' : ''}{word}
              </motion.span>
            ))}
            <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse align-middle" />
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/30 italic">
            Detected words will appear here...
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/30">
        <button
          onClick={speakSentence}
          disabled={sentence.length === 0}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            isSpeaking
              ? 'bg-primary text-primary-foreground animate-pulse'
              : 'bg-primary/15 text-primary hover:bg-primary/25'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          {isSpeaking ? 'Speaking...' : 'Speak'}
        </button>
        <button
          onClick={undoLastWord}
          disabled={sentence.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Undo
        </button>
        <button
          onClick={clearSentence}
          disabled={sentence.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
}

export default memo(SentenceBuilder);
