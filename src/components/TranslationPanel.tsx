import { memo, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  Hello: { hi: 'नमस्ते', bn: 'হ্যালো' },
  'Thank you': { hi: 'धन्यवाद', bn: 'ধন্যবাদ' },
  Yes: { hi: 'हाँ', bn: 'হ্যাঁ' },
  No: { hi: 'नहीं', bn: 'না' },
  Please: { hi: 'कृपया', bn: 'দয়া করে' },
  Sorry: { hi: 'माफ़ करें', bn: 'দুঃখিত' },
  Help: { hi: 'मदद', bn: 'সাহায্য' },
  Good: { hi: 'अच्छा', bn: 'ভালো' },
  Bad: { hi: 'बुरा', bn: 'খারাপ' },
  Love: { hi: 'प्यार', bn: 'ভালোবাসা' },
};

function translate(words: string[], lang: 'hi' | 'bn'): string {
  return words
    .map((w) => {
      const clean = w.replace(/[.,!?]/g, '');
      const punct = w.slice(clean.length);
      return (TRANSLATIONS[clean]?.[lang] || clean) + punct;
    })
    .join(' ');
}

function TranslationPanel() {
  const sentence = useAppStore((s) => s.sentence);
  const hindi = useMemo(() => translate(sentence, 'hi'), [sentence]);
  const bengali = useMemo(() => translate(sentence, 'bn'), [sentence]);

  if (sentence.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-card rounded-2xl p-4 space-y-3"
    >
      <div className="panel-header">
        <Languages className="w-3.5 h-3.5 text-primary" />
        <span className="panel-label">Translations</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Hindi</span>
          <p className="text-sm text-foreground/80 leading-relaxed">{hindi}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">Bengali</span>
          <p className="text-sm text-foreground/80 leading-relaxed">{bengali}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(TranslationPanel);
