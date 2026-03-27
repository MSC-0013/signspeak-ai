import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Play, Square, Trash2, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import ExportButton from './ExportButton';
import GestureManager from './GestureManager';
import MetricsDisplay from './MetricsDisplay';

function ControlsBar() {
  const {
    isDetecting, setDetecting,
    speechEnabled, toggleSpeech,
    clearSentence, resetSession,
    showDebug,
  } = useAppStore();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-4 space-y-3"
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Start/Stop */}
        <button
          onClick={() => setDetecting(!isDetecting)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isDetecting
              ? 'bg-destructive text-destructive-foreground hover:opacity-90'
              : 'bg-primary text-primary-foreground hover:opacity-90 glow-primary'
          }`}
          aria-label={isDetecting ? 'Stop detection' : 'Start detection'}
        >
          {isDetecting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isDetecting ? 'Stop' : 'Start'}
        </button>

        {/* Clear */}
        <button
          onClick={clearSentence}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity"
          aria-label="Clear text"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>

        {/* Speech toggle */}
        <button
          onClick={toggleSpeech}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            speechEnabled
              ? 'bg-primary/15 text-primary'
              : 'bg-secondary text-muted-foreground'
          }`}
          aria-label={speechEnabled ? 'Disable speech' : 'Enable speech'}
        >
          {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <ExportButton />
        <GestureManager />

        {/* New Session */}
        <button
          onClick={resetSession}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity ml-auto"
          aria-label="New session"
        >
          <RotateCcw className="w-4 h-4" />
          New Session
        </button>
      </div>

      {showDebug && <MetricsDisplay />}
    </motion.div>
  );
}

export default memo(ControlsBar);
