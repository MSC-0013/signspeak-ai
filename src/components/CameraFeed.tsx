import { useEffect, useRef, memo, useState, useCallback } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useAppStore } from '@/store/useAppStore';
import { VideoOff, Camera, Hand, SunDim, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initHandModel, detectGesture, resetValidator } from '@/utils/handDetection';
import { SIGN_CATALOG } from '@/utils/gestureClassifier';
import type { DetectionState } from '@/utils/signValidator';

const ease = [0.25, 0.1, 0.25, 1] as const;

export interface DetectionInfo {
  sign: string;
  emoji: string;
  confidence: number;
  state: DetectionState;
  quality: 'high' | 'medium' | 'low';
  stabilityFrames: number;
  landmarks: number[][] | null;
}

interface CameraFeedProps {
  onDetection?: (info: DetectionInfo) => void;
}

function CameraFeed({ onDetection }: CameraFeedProps) {
  const { videoRef, startCamera, stopCamera } = useCamera();
  const { isDetecting, cameraError, setFps, gestureFlash } = useAppStore();
  const detectionRef = useRef<ReturnType<typeof requestAnimationFrame>>();
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });
  const [modelLoading, setModelLoading] = useState(true);
  const lastDetectionRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectionState, setDetectionState] = useState<DetectionState>('UNCLEAR');
  const [currentSign, setCurrentSign] = useState<{ sign: string; emoji: string; confidence: number } | null>(null);

  useEffect(() => {
    initHandModel()
      .then(() => setModelLoading(false))
      .catch(() => setModelLoading(false));
  }, []);

  const drawLandmarks = useCallback((canvas: HTMLCanvasElement, landmarks: number[][]) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const video = canvas.parentElement?.querySelector('video');
    if (!video) return;
    canvas.width = video.videoWidth || canvas.offsetWidth;
    canvas.height = video.videoHeight || canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17],
    ];

    ctx.strokeStyle = 'hsl(199, 89%, 48%)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'hsl(199, 89%, 48%)';
    ctx.shadowBlur = 8;
    connections.forEach(([a, b]) => {
      if (landmarks[a] && landmarks[b]) {
        ctx.beginPath();
        ctx.moveTo(landmarks[a][0], landmarks[a][1]);
        ctx.lineTo(landmarks[b][0], landmarks[b][1]);
        ctx.stroke();
      }
    });

    landmarks.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p[0], p[1], i === 0 ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? 'hsl(38, 92%, 50%)' : 'hsl(199, 89%, 60%)';
      ctx.shadowBlur = 12;
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const runDetection = useCallback(async () => {
    if (!isDetecting || !videoRef.current || modelLoading) return;

    const now = performance.now();
    if (now - lastDetectionRef.current < 100) {
      detectionRef.current = requestAnimationFrame(runDetection);
      return;
    }
    lastDetectionRef.current = now;

    try {
      const result = await detectGesture(videoRef.current);

      if (result.landmarks && canvasRef.current) {
        drawLandmarks(canvasRef.current, result.landmarks);
      }

      setDetectionState(result.state);

      if (result.sign !== 'NO_HAND' && result.sign !== 'LOADING' && result.sign !== 'ERROR' && result.sign !== 'UNCLEAR') {
        const emoji = SIGN_CATALOG[result.sign]?.emoji || result.emoji;
        setCurrentSign({ sign: result.sign, emoji, confidence: result.confidence });
      } else {
        setCurrentSign(null);
      }

      onDetection?.(result);

      fpsRef.current.frames++;
      if (now - fpsRef.current.lastTime >= 1000) {
        setFps(fpsRef.current.frames);
        fpsRef.current = { frames: 0, lastTime: now };
      }
    } catch (error) {
      console.error('Detection error:', error);
    }

    detectionRef.current = requestAnimationFrame(runDetection);
  }, [isDetecting, videoRef, modelLoading, drawLandmarks, onDetection, setFps]);

  useEffect(() => {
    if (isDetecting) {
      startCamera();
      resetValidator();
      detectionRef.current = requestAnimationFrame(runDetection);
    } else {
      stopCamera();
      if (detectionRef.current) cancelAnimationFrame(detectionRef.current);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setCurrentSign(null);
      setDetectionState('UNCLEAR');
    }
    return () => {
      if (detectionRef.current) cancelAnimationFrame(detectionRef.current);
    };
  }, [isDetecting, startCamera, stopCamera, runDetection]);

  const qualityBadge = () => {
    if (!isDetecting) return null;
    if (detectionState === 'CONFIRMED') return (
      <div className="flex items-center gap-1.5 glass-strong rounded-lg px-2.5 py-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-[10px] font-medium text-emerald-400">Hand Detected</span>
      </div>
    );
    if (detectionState === 'DETECTING') return (
      <div className="flex items-center gap-1.5 glass-strong rounded-lg px-2.5 py-1">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-medium text-amber-400">Detecting…</span>
      </div>
    );
    return (
      <div className="flex items-center gap-1.5 glass-strong rounded-lg px-2.5 py-1">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
        <span className="text-[10px] font-medium text-muted-foreground/60">No Hand</span>
      </div>
    );
  };

  const confColor = currentSign
    ? currentSign.confidence >= 0.85 ? 'text-emerald-400' : currentSign.confidence >= 0.7 ? 'text-amber-400' : 'text-red-400'
    : '';

  return (
    <div className="relative w-full h-full">
      <div
        className={`relative w-full aspect-[16/8.8] rounded-2xl overflow-hidden bg-card transition-all duration-500 ${
          gestureFlash ? 'ring-2 ring-primary/50 glow-primary' : 'ring-1 ring-border/40'
        }`}
      >
        {cameraError || modelLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center z-10">
            <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center">
              {modelLoading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <VideoOff className="w-6 h-6 text-destructive/60" />}
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground/80">{modelLoading ? 'Loading AI Model…' : 'Camera unavailable'}</p>
              <p className="text-xs text-muted-foreground/60 max-w-xs">{modelLoading ? 'Initializing TensorFlow.js Handpose…' : cameraError}</p>
            </div>
          </div>
        ) : !isDetecting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-10">
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
              <p className="text-xs text-muted-foreground/30">Press <span className="font-medium text-muted-foreground/50">Start Detection</span> to begin</p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/30"><SunDim className="w-3 h-3" />Good lighting</div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/30"><Hand className="w-3 h-3" />Clear hand view</div>
            </div>
          </div>
        ) : null}

        <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transition-opacity duration-700 ${isDetecting ? 'opacity-100' : 'opacity-0'}`} />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ objectFit: 'cover' }} />

        {/* Positioning guide */}
        {isDetecting && detectionState === 'UNCLEAR' && (
          <div className="absolute inset-[15%] rounded-xl border-2 border-dashed border-muted-foreground/15 pointer-events-none flex items-center justify-center">
            <span className="text-xs text-muted-foreground/30">Position hand here</span>
          </div>
        )}

        {/* Corner markers when detecting */}
        {isDetecting && detectionState !== 'UNCLEAR' && (
          <div className="absolute inset-[10%] pointer-events-none">
            <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
            <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
            <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
            <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
          </div>
        )}

        {/* Top bar: LIVE + quality */}
        {isDetecting && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 glass-strong rounded-lg px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-widest text-foreground/80 uppercase">Live</span>
            </div>
            {qualityBadge()}
          </div>
        )}

        {/* Sign feedback overlay */}
        <AnimatePresence>
          {isDetecting && currentSign && (
            <motion.div
              key={currentSign.sign}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-3 left-3 right-3 glass-strong rounded-xl px-4 py-3 flex items-center gap-3 z-20"
            >
              <span className="text-2xl">{currentSign.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{SIGN_CATALOG[currentSign.sign]?.label || currentSign.sign.replace(/_/g, ' ')}</p>
                <div className="mt-1 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${currentSign.confidence >= 0.85 ? 'bg-emerald-400' : currentSign.confidence >= 0.7 ? 'bg-amber-400' : 'bg-red-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${currentSign.confidence * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <span className={`text-xs font-mono ${confColor}`}>{(currentSign.confidence * 100).toFixed(0)}%</span>
              {detectionState === 'CONFIRMED' && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400 text-xs font-bold">✓</motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No hand guidance */}
        <AnimatePresence>
          {isDetecting && !currentSign && detectionState === 'UNCLEAR' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-3 left-3 glass-strong rounded-xl px-3 py-2 z-20">
              <span className="text-xs text-muted-foreground/60">Position your hand in frame…</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(CameraFeed);
