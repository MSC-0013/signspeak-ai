import { memo, useState } from 'react';
import { SIGN_CATALOG } from '@/utils/gestureClassifier';
import { motion } from 'framer-motion';

const categories = ['All', 'Greetings', 'Responses', 'Questions', 'Emotions', 'Actions'] as const;

function QuickSignBar() {
  const [active, setActive] = useState<string>('All');

  const filtered = Object.entries(SIGN_CATALOG).filter(
    ([, v]) => active === 'All' || v.category === active
  );

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <span className="panel-label">Quick Signs</span>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
              active === c
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto scrollbar-thin">
        {filtered.map(([sign, info]) => (
          <motion.div
            key={sign}
            whileHover={{ scale: 1.04 }}
            className="flex flex-col items-center gap-1 p-2 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-default"
          >
            <span className="text-lg">{info.emoji}</span>
            <span className="text-[10px] font-medium text-foreground/70 text-center leading-tight">{sign.replace(/_/g, ' ')}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default memo(QuickSignBar);