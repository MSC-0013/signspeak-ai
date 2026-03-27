import { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { setCameraError } = useAppStore();

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError(
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions.'
          : 'Failed to access camera. Please check your device.'
      );
    }
  }, [setCameraError]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { videoRef, startCamera, stopCamera };
}
