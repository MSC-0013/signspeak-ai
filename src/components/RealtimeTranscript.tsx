import { memo, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Copy, Undo2, Trash2 } from 'lucide-react';
import { SIGN_CATALOG } from '@/utils/gestureClassifier';

function RealtimeTranscript() {
  const { sentence, undoLastWord, clearSentence, speechEnabled } = useAppStore();

  const speakAll = useCallback(() => {
    if (sentence.length === 0) return;
    const u = new SpeechSynthesisUtterance(sentence.join(' '));
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }, [sentence]);

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(sentence.join(' '));
  }, [sentence]);

  return (
    <div className="glass-card rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="panel-label">Live Transcript</span>
        <div className="flex items-center gap-1">
          <button onClick={speakAll} disabled={sentence.length === 0} className="btn-ghost" title="Speak"><Volume2 className="w-3.5 h-3.5" /></button>
          <button onClick={copyAll} disabled={sentence.length === 0} className="btn-ghost" title="Copy"><Copy className="w-3.5 h-3.5" /></button>
          <button onClick={undoLastWord} disabled={sentence.length === 0} className="btn-ghost" title="Undo"><Undo2 className="w-3.5 h-3.5" /></button>
          <button onClick={clearSentence} disabled={sentence.length === 0} className="btn-danger-sm" title="Clear"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 min-h-[80px] flex flex-wrap content-start gap-2 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {sentence.map((word, i) => {
            const key = word.toUpperCase().replace(/ /g, '_');
            const emoji = SIGN_CATALOG[key]?.emoji || SIGN_CATALOG[word.toUpperCase()]?.emoji;
            const label = SIGN_CATALOG[key]?.label || word;
            return (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium"
              >
                {emoji && <span className="text-base">{emoji}</span>}
                {label}
              </motion.span>
            );
          })}
        </AnimatePresence>

        {sentence.length > 0 && (
          <span className="inline-block w-0.5 h-5 bg-primary/60 animate-pulse rounded-full self-center" />
        )}

        {sentence.length === 0 && (
          <p className="text-xs text-muted-foreground/40 self-center mx-auto">Detected signs will appear here…</p>
        )}
      </div>
    </div>
  );
}

export default memo(RealtimeTranscript);