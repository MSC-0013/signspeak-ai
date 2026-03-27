import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Settings, X, Volume2, Eye, Sparkles, Shield, Bug, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'es-ES', label: 'Español' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'ja-JP', label: '日本語' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'bn-IN', label: 'বাংলা' },
];

function Toggle({ enabled, onToggle, label, icon: Icon }: { enabled: boolean; onToggle: () => void; label: string; icon: React.ElementType }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors relative ${enabled ? 'bg-primary' : 'bg-secondary'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${enabled ? 'left-5' : 'left-1'}`} />
      </div>
    </button>
  );
}

function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const {
    speechEnabled, toggleSpeech,
    smoothingEnabled, toggleSmoothing,
    keypointOverlayVisible, toggleKeypointOverlay,
    privacyMode, togglePrivacyMode,
    showDebug, toggleDebug,
    isDark, toggleTheme,
    language, setLanguage,
  } = useAppStore();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-80 glass-strong z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Settings</h2>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-4 mb-2">Features</p>
                <Toggle enabled={speechEnabled} onToggle={toggleSpeech} label="Speech Output" icon={Volume2} />
                <Toggle enabled={smoothingEnabled} onToggle={toggleSmoothing} label="Prediction Smoothing" icon={Sparkles} />
                <Toggle enabled={keypointOverlayVisible} onToggle={toggleKeypointOverlay} label="Keypoint Overlay" icon={Eye} />
                <Toggle enabled={showDebug} onToggle={toggleDebug} label="Debug Panel" icon={Bug} />
              </div>

              <div className="my-4 border-t border-border" />

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-4 mb-2">Appearance</p>
                <Toggle enabled={isDark} onToggle={toggleTheme} label={isDark ? 'Dark Mode' : 'Light Mode'} icon={isDark ? Moon : Sun} />
              </div>

              <div className="my-4 border-t border-border" />

              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-4 mb-2">Privacy</p>
                <Toggle enabled={privacyMode} onToggle={togglePrivacyMode} label="Privacy Mode" icon={Shield} />
                <p className="text-xs text-muted-foreground px-4">When enabled, no history or session data is stored.</p>
              </div>

              <div className="my-4 border-t border-border" />

              <div className="px-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Language</p>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex-1 bg-secondary text-secondary-foreground text-sm rounded-xl px-3 py-2 border-none outline-none cursor-pointer"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="my-4 border-t border-border" />

              <div className="px-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Keyboard Shortcuts</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {[
                    ['Space', 'Start / Stop'],
                    ['Enter', 'Speak sentence'],
                    ['Backspace', 'Undo last word'],
                    ['C', 'Clear session'],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span>{desc}</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-secondary font-mono text-xs">{key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(SettingsPanel);
