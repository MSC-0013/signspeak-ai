import { useEffect, useRef, memo } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore } from '@/store/useAppStore';
import { usePrediction } from '@/hooks/usePrediction';
import { VideoOff, Camera, Play, Square, RotateCcw } from 'lucide-react';
import KeypointOverlay from './KeypointOverlay';

function CameraFeed() {
  const { videoRef, startCamera, stopCamera } = useCamera();
  const { isDetecting, cameraError, setFps, setDetecting, clearSentence, keypointOverlayVisible, gestureFlash } = useAppStore();
  const { simulatePrediction } = usePrediction();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });

  useEffect(() => {
    if (isDetecting) {
      startCamera();
      // 2 second minimum interval per detection
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
    <div
      className={`relative w-full aspect-video rounded-2xl overflow-hidden bg-muted/30 ring-1 transition-all duration-500 ${
        gestureFlash
          ? 'ring-primary/50 shadow-[0_0_60px_-12px_hsl(var(--primary)/0.3)]'
          : 'ring-border/40'
      }`}
    >
      {/* Webcam default grey state */}
      {cameraError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center bg-muted/20">
          <VideoOff className="w-12 h-12 text-destructive/50" />
          <p className="text-sm text-muted-foreground/70">{cameraError}</p>
        </div>
      ) : !isDetecting ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-muted/10">
          <div className="w-20 h-20 rounded-3xl bg-secondary/60 flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-base text-muted-foreground/50 font-medium">Camera Preview</p>
            <p className="text-xs text-muted-foreground/30">
              Press <kbd className="px-1.5 py-0.5 rounded-md bg-secondary/60 font-mono text-[10px] text-muted-foreground/50">Space</kbd> or click Start
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

      {/* LIVE indicator */}
      {isDetecting && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wider text-foreground/90 bg-card/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
            LIVE
          </span>
        </div>
      )}

      {/* Controls overlay — bottom of camera */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <button
          onClick={() => setDetecting(!isDetecting)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium backdrop-blur-md transition-all duration-200 ${
            isDetecting
              ? 'bg-destructive/20 text-destructive hover:bg-destructive/30 ring-1 ring-destructive/20'
              : 'bg-primary/20 text-primary hover:bg-primary/30 ring-1 ring-primary/20'
          }`}
        >
          {isDetecting ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isDetecting ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={clearSentence}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground bg-card/50 backdrop-blur-md hover:bg-card/70 ring-1 ring-border/20 transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

export default memo(CameraFeed);
