import { memo, useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Circle, Square, RotateCcw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SessionControls() {
  const { isRecording, startRecording, stopRecording, sessionHistory } = useAppStore();
  const [replaying, setReplaying] = useState(false);
  const [replayWord, setReplayWord] = useState('');

  const replayLast = useCallback(() => {
    const last = sessionHistory[sessionHistory.length - 1];
    if (!last || replaying) return;
    setReplaying(true);
    let i = 0;
    const iv = setInterval(() => {
      if (i >= last.predictions.length) {
        clearInterval(iv);
        setReplaying(false);
        setReplayWord('');
        return;
      }
      setReplayWord(last.predictions[i].word);
      i++;
    }, 600);
  }, [sessionHistory, replaying]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Session Recording
        </span>
        {isRecording && (
          <span className="flex items-center gap-1.5 text-[10px] text-red-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Recording
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
          >
            <Circle className="w-3 h-3 fill-current" />
            Record
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
          >
            <Square className="w-3 h-3" />
            Stop
          </button>
        )}

        <button
          onClick={replayLast}
          disabled={sessionHistory.length === 0 || replaying}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Play className="w-3 h-3" />
          Replay Last
        </button>

        <span className="text-[10px] text-muted-foreground/40 ml-auto">
          {sessionHistory.length} session{sessionHistory.length !== 1 ? 's' : ''}
        </span>
      </div>

      <AnimatePresence>
        {replaying && replayWord && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center"
          >
            <span className="text-lg font-bold text-primary">{replayWord}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(SessionControls);
