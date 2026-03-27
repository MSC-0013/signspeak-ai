import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Play, Square, Trash2, Volume2, VolumeX, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'es-ES', label: 'Español' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'ja-JP', label: '日本語' },
];

function ControlsBar() {
  const {
    isDetecting, setDetecting,
    speechEnabled, toggleSpeech,
    language, setLanguage,
    clearSentence,
  } = useAppStore();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3"
    >
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

      {/* Language */}
      <div className="flex items-center gap-2 ml-auto">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-secondary text-secondary-foreground text-sm rounded-xl px-3 py-2 border-none outline-none cursor-pointer"
          aria-label="Select language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}

export default memo(ControlsBar);
