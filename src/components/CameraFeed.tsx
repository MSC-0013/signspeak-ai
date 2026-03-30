import { useEffect, useRef, memo } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore } from '@/store/useAppStore';
import { usePrediction } from '@/hooks/usePrediction';
import { VideoOff, Camera } from 'lucide-react';
import KeypointOverlay from './KeypointOverlay';

function CameraFeed() {
  const { videoRef, startCamera, stopCamera } = useCamera();
  const { isDetecting, cameraError, setFps, keypointOverlayVisible, gestureFlash } = useAppStore();
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
      }, 200);
    } else {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDetecting, startCamera, stopCamera, simulatePrediction, setFps]);

  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card/50 ring-1 transition-all duration-500 ${
        gestureFlash
          ? 'ring-primary/40 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)]'
          : 'ring-border/30'
      }`}
    >
      {cameraError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <VideoOff className="w-10 h-10 text-destructive/60" />
          <p className="text-sm text-muted-foreground/70">{cameraError}</p>
        </div>
      ) : !isDetecting ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center">
            <Camera className="w-6 h-6 text-primary/40" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground/60">Camera feed</p>
            <p className="text-xs text-muted-foreground/40">
              Press <kbd className="px-1.5 py-0.5 rounded-md bg-secondary/50 font-mono text-[10px]">Space</kbd> to start
            </p>
          </div>
        </div>
      ) : null}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${isDetecting ? 'opacity-100' : 'opacity-0'}`}
      />

      {isDetecting && keypointOverlayVisible && <KeypointOverlay />}

      {isDetecting && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] font-medium text-foreground/80 bg-card/60 backdrop-blur-md px-2 py-0.5 rounded-md">
            LIVE
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(CameraFeed);
