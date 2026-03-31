import { useEffect, useRef, memo } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore } from '@/store/useAppStore';
import { usePrediction } from '@/hooks/usePrediction';
import { VideoOff, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import KeypointOverlay from './KeypointOverlay';

function CameraFeed() {
  const { videoRef, startCamera, stopCamera } = useCamera();
  const {
    isDetecting, cameraError, setFps, setDetecting,
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
      {/* Main camera container */}
      <div
        className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-muted/20 transition-all duration-500 ${
          gestureFlash
            ? 'ring-2 ring-primary/60 shadow-[0_0_80px_-15px_hsl(var(--primary)/0.4)]'
            : 'ring-1 ring-border/30'
        }`}
      >
        {/* Camera error */}
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center bg-muted/10">
            <VideoOff className="w-10 h-10 text-destructive/40" />
            <p className="text-sm text-muted-foreground/60">{cameraError}</p>
          </div>
        ) : !isDetecting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-muted/5">
            <div className="w-16 h-16 rounded-2xl bg-secondary/40 flex items-center justify-center">
              <Camera className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-sm text-muted-foreground/40 font-medium">Camera Preview</p>
              <p className="text-xs text-muted-foreground/25">
                Click <span className="font-medium text-muted-foreground/40">Start Detection</span> to begin
              </p>
            </div>
          </div>
        ) : null}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-700 ${isDetecting ? 'opacity-100' : 'opacity-0'}`}
        />

        {isDetecting && keypointOverlayVisible && <KeypointOverlay />}

        {/* Detection overlay — simulated bounding box */}
        {isDetecting && currentPrediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-[15%] rounded-xl border-2 border-primary/30 pointer-events-none"
          >
            <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-primary/70 rounded-tl-md" />
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-primary/70 rounded-tr-md" />
            <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-primary/70 rounded-bl-md" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-primary/70 rounded-br-md" />
          </motion.div>
        )}

        {/* LIVE indicator */}
        {isDetecting && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-semibold tracking-widest text-foreground/80 bg-card/60 backdrop-blur-md px-2 py-0.5 rounded-md uppercase">
              Live
            </span>
          </div>
        )}

        {/* Floating prediction badge */}
        <AnimatePresence>
          {isDetecting && currentPrediction && (
            <motion.div
              key={currentPrediction.word + currentPrediction.timestamp}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute bottom-3 left-3 bg-primary/20 backdrop-blur-xl text-primary font-semibold text-sm px-3 py-1.5 rounded-lg border border-primary/20"
            >
              {currentPrediction.word}
              <span className="ml-2 text-xs opacity-70">
                {(currentPrediction.confidence * 100).toFixed(0)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(CameraFeed);
