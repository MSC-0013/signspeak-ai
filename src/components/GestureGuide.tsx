import { memo, useState } from 'react';
import { SIGN_CATALOG } from '@/utils/gestureClassifier';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function GestureGuide() {
  const [open, setOpen] = useState(false);
  const entries = Object.entries(SIGN_CATALOG);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors"
      >
        <span className="panel-label mb-0">Gesture Guide ({entries.length} signs)</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground/50" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/50" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 pb-4 max-h-[300px] overflow-y-auto scrollbar-thin">
              {entries.map(([sign, info]) => (
                <div key={sign} className="flex items-start gap-2 p-2 rounded-xl bg-secondary/20">
                  <span className="text-lg shrink-0">{info.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-foreground/80 truncate">{sign.replace(/_/g, ' ')}</p>
                    <p className="text-[9px] text-muted-foreground/50 leading-tight">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(GestureGuide);