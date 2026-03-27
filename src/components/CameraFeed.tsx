import { useEffect, useRef, memo } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore } from '@/store/useAppStore';
import { usePrediction } from '@/hooks/usePrediction';
import { VideoOff, Camera } from 'lucide-react';
import KeypointOverlay from './KeypointOverlay';

function CameraFeed() {
  const { videoRef, startCamera, stopCamera } = useCamera();
  const { isDetecting, cameraError, setFps } = useAppStore();
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
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border">
      {cameraError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <VideoOff className="w-12 h-12 text-destructive" />
          <p className="text-sm text-muted-foreground">{cameraError}</p>
        </div>
      ) : !isDetecting ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Camera feed will appear here</p>
        </div>
      ) : null}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${isDetecting ? 'opacity-100' : 'opacity-0'}`}
      />
      {isDetecting && <KeypointOverlay />}
      {isDetecting && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs font-medium text-foreground bg-secondary/80 backdrop-blur px-2 py-0.5 rounded-md">
            LIVE
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(CameraFeed);
