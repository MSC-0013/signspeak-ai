import { useEffect, useRef, memo } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore } from '@/store/useAppStore';
import { usePrediction } from '@/hooks/usePrediction';
import { VideoOff, Camera, Hand, SunDim } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import KeypointOverlay from './KeypointOverlay';

const ease = [0.25, 0.1, 0.25, 1] as const;

function CameraFeed() {
  const { videoRef, startCamera, stopCamera } = useCamera();
  const {
    isDetecting, cameraError, setFps,
    keypointOverlayVisible, gestureFlash, currentPrediction,
  } = useAppStore();
  const { simulatePrediction } = usePrediction();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });

  useEffect(() => {
    if (isDetecting) {
      startCamera();
      intervalRef.current = setInterval(() => {
        simulatePrediction();
        fpsRef.current.frames++;
        const now = performance.now();
        if (now - fpsRef.current.lastTime >= 1000) {
          setFps(fpsRef.current.frames);
          fpsRef.current = { frames: 0, lastTime: now };
        }
      }, 2000);
    } else {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDetecting, startCamera, stopCamera, simulatePrediction, setFps]);

  return (
    <div className="relative w-full h-full">
      <div
        className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-card transition-all duration-500 ${
          gestureFlash
            ? 'ring-2 ring-primary/50 glow-primary'
            : 'ring-1 ring-border/40'
        }`}
      >
        {/* Camera error state */}
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <VideoOff className="w-6 h-6 text-destructive/60" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground/80">Camera unavailable</p>
              <p className="text-xs text-muted-foreground/60 max-w-xs">{cameraError}</p>
            </div>
          </div>
        ) : !isDetecting ? (
          /* Idle state */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-secondary/50 flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Hand className="w-3.5 h-3.5 text-primary/50" />
              </div>
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground/50">Camera Ready</p>
              <p className="text-xs text-muted-foreground/30">
                Press <span className="font-medium text-muted-foreground/50">Start Detection</span> to begin
              </p>
            </div>
            {/* Guidance tips */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/30">
                <SunDim className="w-3 h-3" />
                Good lighting
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/30">
                <Hand className="w-3 h-3" />
                Clear hand view
              </div>
            </div>
          </div>
        ) : null}

        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-700 ${isDetecting ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Keypoint overlay */}
        {isDetecting && keypointOverlayVisible && <KeypointOverlay />}

        {/* Detection bounding box */}
        {isDetecting && currentPrediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-[12%] rounded-xl border border-primary/20 pointer-events-none"
          >
            <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
            <div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
            <div className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
            <div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
          </motion.div>
        )}

        {/* LIVE + Status bar */}
        {isDetecting && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2 glass-strong rounded-lg px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-widest text-foreground/80 uppercase">
                Live
              </span>
            </div>
            {currentPrediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong rounded-lg px-2.5 py-1"
              >
                <span className="text-[10px] font-mono text-primary">
                  {(currentPrediction.confidence * 100).toFixed(0)}% conf
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* Floating prediction badge */}
        <AnimatePresence>
          {isDetecting && currentPrediction && (
            <motion.div
              key={currentPrediction.word + currentPrediction.timestamp}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.4, ease }}
              className="absolute bottom-3 left-3 glass-strong rounded-xl px-4 py-2 flex items-center gap-3"
            >
              <span className="text-base font-semibold text-foreground">
                {currentPrediction.word}
              </span>
              <div className="h-4 w-px bg-border/40" />
              <span className="text-xs font-mono text-primary">
                {(currentPrediction.confidence * 100).toFixed(0)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No hand guidance (show when detecting but no prediction for a bit) */}
        <AnimatePresence>
          {isDetecting && !currentPrediction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-3 glass-strong rounded-xl px-3 py-2"
            >
              <span className="text-xs text-muted-foreground/60">
                Position your hand in frame…
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(CameraFeed);
