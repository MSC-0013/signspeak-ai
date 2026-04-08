import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Hand, Sparkles, ArrowRight, X } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    title: 'Allow Camera Access',
    desc: 'We need your webcam to detect hand gestures in real-time. Your video stays on your device.',
  },
  {
    icon: Hand,
    title: 'Position Your Hand',
    desc: 'Hold your hand in front of the camera at chest height. Keep it well-lit and clearly visible.',
  },
  {
    icon: Sparkles,
    title: 'Start Signing',
    desc: 'Make sign language gestures and watch them convert to text instantly. The AI learns as you go.',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

function OnboardingModal({ open, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0);

  const next = useCallback(() => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  if (!open) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="glass-card rounded-2xl p-8 w-full max-w-md mx-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 btn-ghost !h-7 !px-1.5"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-primary' : i < step ? 'w-3 bg-primary/40' : 'w-3 bg-border'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{current.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                {current.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>
            <button
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(OnboardingModal);
