import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Play, Square, RotateCcw } from 'lucide-react';

function AppControls() {
  const { isDetecting, setDetecting, clearSentence } = useAppStore();

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => setDetecting(!isDetecting)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isDetecting
            ? 'bg-destructive/10 text-destructive hover:bg-destructive/15'
            : 'bg-primary/10 text-primary hover:bg-primary/15'
        }`}
      >
        {isDetecting ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        {isDetecting ? 'Stop' : 'Start'}
      </button>

      <button
        onClick={clearSentence}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset
      </button>
    </div>
  );
}

export default memo(AppControls);
