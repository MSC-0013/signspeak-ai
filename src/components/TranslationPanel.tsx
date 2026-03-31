import { memo, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Languages } from 'lucide-react';

// Simple mock translations
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
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Languages className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Translations
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Hindi</span>
          <p className="text-sm text-foreground/80 leading-relaxed">{hindi}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Bengali</span>
          <p className="text-sm text-foreground/80 leading-relaxed">{bengali}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(TranslationPanel);
