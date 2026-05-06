import { memo, useState } from 'react';
import { SIGN_CATALOG } from '@/utils/gestureClassifier';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const categories = ['All', 'basic', 'responses', 'actions'] as const;
const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const itemVariant = { hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { duration: 0.3 } } };

function QuickSignBar() {
  const [active, setActive] = useState<string>('All');

  const filtered = Object.entries(SIGN_CATALOG).filter(
    ([, v]) => active === 'All' || v.category === active
  );

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick Signs</span>
        </div>
        <span className="text-[10px] text-muted-foreground/50 font-mono">{filtered.length} signs</span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {categories.map((c) => {
          const count = c === 'All' ? Object.keys(SIGN_CATALOG).length : Object.values(SIGN_CATALOG).filter(v => v.category === c).length;
          return (
            <motion.button
              key={c}
              onClick={() => setActive(c)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                active === c
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60 border border-white/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>{c}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div 
        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filtered.map(([sign, info]) => (
          <motion.div
            key={sign}
            variants={itemVariant}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.92 }}
            className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 hover:from-primary/20 hover:to-primary/10 border border-white/5 hover:border-primary/30 transition-all duration-200 cursor-default"
          >
            <span className="text-3xl leading-none transition-transform group-hover:scale-110" title={info.description}>
              {info.emoji}
            </span>
            <span className="text-[10px] font-semibold text-foreground/80 text-center leading-tight line-clamp-2 group-hover:text-foreground transition-colors">
              {info.label || sign.replace(/_/g, ' ')}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default memo(QuickSignBar);