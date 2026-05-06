import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Undo2, Trash2, Volume2, AlertCircle, Check, Copy } from 'lucide-react';
import { useState, useCallback } from 'react';

const ease = [0.25, 0.1, 0.25, 1] as const;

function SentenceBuilder() {
  const {
    sentence, currentPrediction, undoLastWord, clearSentence,
    isSpeaking, setIsSpeaking, setShowCorrectionModal,
  } = useAppStore();
  const [copied, setCopied] = useState(false);

  const speakSentence = useCallback(() => {
    if (sentence.length === 0 || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence.join(' '));
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [sentence, setIsSpeaking]);

  const copySentence = useCallback(() => {
    navigator.clipboard.writeText(sentence.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sentence]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="panel-header !mb-0">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="panel-label">Sentence Builder</span>
        </div>
        <button
          onClick={() => setShowCorrectionModal(true)}
          disabled={!currentPrediction}
          className="btn-danger-sm !h-7 !text-[10px]"
        >
          <AlertCircle className="w-3 h-3" />
          Wrong?
        </button>
      </div>

      {/* Current detection */}
      <div className="mb-4 p-3 rounded-xl bg-secondary/40">
        <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1.5 block">
          Current Detection
        </span>
        <AnimatePresence mode="wait">
          {currentPrediction && currentPrediction.word !== 'UNKNOWN' ? (
            <motion.div
              key={currentPrediction.word + currentPrediction.timestamp}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease }}
              className="flex items-baseline gap-3"
            >
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {currentPrediction.word}
              </p>
              <span className="text-xs font-mono text-primary/70">
                {(currentPrediction.confidence * 100).toFixed(0)}%
              </span>
            </motion.div>
          ) : currentPrediction ? (
            <p className="text-sm text-muted-foreground/30 italic">Gesture not recognized</p>
          ) : (
            <p className="text-sm text-muted-foreground/30 italic">Waiting for gesture…</p>
          )}
        </AnimatePresence>
      </div>

      {/* Sentence display */}
      <div className="flex-1 min-h-0 mb-4 overflow-y-auto scrollbar-thin">
        <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1.5 block">
          Built Sentence
        </span>
        {sentence.length > 0 ? (
          <p className="text-lg leading-relaxed text-foreground">
            {sentence.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className="inline"
              >
                {i > 0 ? ' ' : ''}{word}
              </motion.span>
            ))}
            <span className="inline-block w-0.5 h-5 bg-primary/60 ml-1 animate-pulse align-middle rounded-full" />
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/25 italic">
            Detected words will appear here…
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/20">
        <button
          onClick={speakSentence}
          disabled={sentence.length === 0}
          className={`btn-primary-sm ${isSpeaking ? '!bg-primary !text-primary-foreground animate-pulse' : ''}`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          {isSpeaking ? 'Speaking…' : 'Speak'}
        </button>
        <button onClick={copySentence} disabled={sentence.length === 0} className="btn-ghost">
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <div className="flex-1" />
        <button onClick={undoLastWord} disabled={sentence.length === 0} className="btn-ghost">
          <Undo2 className="w-3.5 h-3.5" />
          Undo
        </button>
        <button onClick={clearSentence} disabled={sentence.length === 0} className="btn-ghost">
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
}

export default memo(SentenceBuilder);
