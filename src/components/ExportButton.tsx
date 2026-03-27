import { memo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Download, Copy, Check, FileText, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ExportButton() {
  const { conversationHistory, sentence } = useAppStore();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportTxt = () => {
    const text = sentence.join(' ');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signai-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(conversationHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signai-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sentence.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity"
        aria-label="Export"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute bottom-full mb-2 left-0 glass rounded-xl p-2 min-w-[160px] space-y-1 z-10"
          >
            <button onClick={exportTxt} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-foreground">
              <FileText className="w-4 h-4" /> Export .txt
            </button>
            <button onClick={exportJson} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-foreground">
              <FileJson className="w-4 h-4" /> Export .json
            </button>
            <button onClick={copyToClipboard} className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-foreground">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              Copy to clipboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ExportButton);
