import { memo, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function ConversationHistory() {
  const { conversationHistory, clearHistory } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [conversationHistory.length]);

  const copyAll = () => {
    const text = conversationHistory.map((m) => m.text).join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceColor = (c: number) => {
    if (c >= 0.9) return 'bg-primary/20 border-primary/30';
    if (c >= 0.7) return 'bg-accent/15 border-accent/25';
    return 'bg-destructive/15 border-destructive/25';
  };

  return (
    <div className="glass rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">History</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={copyAll} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" aria-label="Copy all">
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={clearHistory} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" aria-label="Clear history">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 min-h-0">
        <AnimatePresence initial={false}>
          {conversationHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No history yet...</p>
          ) : (
            conversationHistory.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`px-3 py-2 rounded-xl border ${getConfidenceColor(msg.confidence)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{msg.text}</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {(msg.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(ConversationHistory);
