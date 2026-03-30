import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Play, Square, RotateCcw } from 'lucide-react';

function AppControls() {
  const { isDetecting, setDetecting, clearSentence } = useAppStore();

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => setDetecting(!isDetecting)}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
          isDetecting
            ? 'bg-destructive text-destructive-foreground hover:opacity-90'
            : 'bg-primary text-primary-foreground hover:opacity-90 glow-primary'
        }`}
      >
        {isDetecting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isDetecting ? 'Stop' : 'Start'}
      </button>

      <button
        onClick={clearSentence}
        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
}

export default memo(AppControls);
