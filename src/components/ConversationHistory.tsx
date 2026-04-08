import { memo, useRef, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, Copy, Check } from 'lucide-react';

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

  if (conversationHistory.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col max-h-[240px]">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="panel-header !mb-0">
          <History className="w-3.5 h-3.5 text-primary" />
          <span className="panel-label">History</span>
          <span className="text-[10px] font-mono text-muted-foreground/35 ml-1">
            ({conversationHistory.length})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={copyAll} className="btn-ghost !h-7 !px-1.5">
            {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
          </button>
          <button onClick={clearHistory} className="btn-ghost !h-7 !px-1.5">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 min-h-0 scrollbar-thin">
        <AnimatePresence initial={false}>
          {conversationHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{msg.text}</span>
                <span className="text-[10px] font-mono text-muted-foreground/40">
                  {(msg.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/30 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(ConversationHistory);
