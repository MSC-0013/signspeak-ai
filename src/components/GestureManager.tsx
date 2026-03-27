import { memo, useState } from 'react';
import { useAppStore, type GestureMapping } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Plus, Trash2, X } from 'lucide-react';

function GestureManager() {
  const { customGestures, addGesture, removeGesture } = useAppStore();
  const [open, setOpen] = useState(false);
  const [gestureId, setGestureId] = useState('');
  const [label, setLabel] = useState('');

  const handleAdd = () => {
    if (!gestureId.trim() || !label.trim()) return;
    addGesture({ id: crypto.randomUUID(), gestureId: gestureId.trim(), label: label.trim() });
    setGestureId('');
    setLabel('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity"
      >
        <Hand className="w-4 h-4" />
        Gestures
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-strong rounded-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Manage Gestures</h2>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  value={gestureId}
                  onChange={(e) => setGestureId(e.target.value)}
                  placeholder="Gesture ID"
                  className="flex-1 bg-secondary text-foreground text-sm rounded-xl px-3 py-2 outline-none placeholder:text-muted-foreground"
                />
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Label"
                  className="flex-1 bg-secondary text-foreground text-sm rounded-xl px-3 py-2 outline-none placeholder:text-muted-foreground"
                />
                <button onClick={handleAdd} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customGestures.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No custom gestures yet</p>
                ) : (
                  customGestures.map((g) => (
                    <div key={g.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/50">
                      <div>
                        <span className="text-sm font-mono text-muted-foreground">{g.gestureId}</span>
                        <span className="text-muted-foreground mx-2">→</span>
                        <span className="text-sm font-medium text-foreground">{g.label}</span>
                      </div>
                      <button onClick={() => removeGesture(g.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(GestureManager);
