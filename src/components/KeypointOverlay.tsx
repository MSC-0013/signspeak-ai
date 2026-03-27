import { useEffect, useRef, memo } from 'react';

function KeypointOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simulated hand keypoints for demo visualization
      const cx = canvas.width / 2 + Math.sin(Date.now() / 1000) * 20;
      const cy = canvas.height / 2 + Math.cos(Date.now() / 800) * 15;
      const points = generateHandPoints(cx, cy, 60);

      // Draw connections
      const connections = [
        [0,1],[1,2],[2,3],[3,4],
        [0,5],[5,6],[6,7],[7,8],
        [0,9],[9,10],[10,11],[11,12],
        [0,13],[13,14],[14,15],[15,16],
        [0,17],[17,18],[18,19],[19,20],
      ];

      ctx.strokeStyle = 'hsl(168, 80%, 45%)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'hsl(168, 80%, 45%)';
      ctx.shadowBlur = 8;
      connections.forEach(([a, b]) => {
        if (points[a] && points[b]) {
          ctx.beginPath();
          ctx.moveTo(points[a][0], points[a][1]);
          ctx.lineTo(points[b][0], points[b][1]);
          ctx.stroke();
        }
      });

      // Draw points
      ctx.shadowBlur = 12;
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(168, 80%, 55%)';
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

function generateHandPoints(cx: number, cy: number, scale: number): [number, number][] {
  const t = Date.now() / 2000;
  const pts: [number, number][] = [];
  // Wrist
  pts.push([cx, cy + scale]);
  // Thumb
  pts.push([cx - scale * 0.6, cy + scale * 0.5]);
  pts.push([cx - scale * 0.9, cy + scale * 0.1 + Math.sin(t) * 5]);
  pts.push([cx - scale * 1.0, cy - scale * 0.2 + Math.sin(t + 1) * 5]);
  pts.push([cx - scale * 1.0, cy - scale * 0.5 + Math.sin(t + 2) * 5]);
  // Index
  pts.push([cx - scale * 0.3, cy + scale * 0.3]);
  pts.push([cx - scale * 0.35, cy - scale * 0.2]);
  pts.push([cx - scale * 0.35, cy - scale * 0.6 + Math.sin(t) * 4]);
  pts.push([cx - scale * 0.35, cy - scale * 0.9 + Math.sin(t + 0.5) * 4]);
  // Middle
  pts.push([cx, cy + scale * 0.25]);
  pts.push([cx, cy - scale * 0.3]);
  pts.push([cx, cy - scale * 0.7 + Math.sin(t + 1) * 4]);
  pts.push([cx, cy - scale * 1.0 + Math.sin(t + 1.5) * 4]);
  // Ring
  pts.push([cx + scale * 0.3, cy + scale * 0.3]);
  pts.push([cx + scale * 0.3, cy - scale * 0.15]);
  pts.push([cx + scale * 0.3, cy - scale * 0.5 + Math.sin(t + 2) * 4]);
  pts.push([cx + scale * 0.3, cy - scale * 0.8 + Math.sin(t + 2.5) * 4]);
  // Pinky
  pts.push([cx + scale * 0.55, cy + scale * 0.4]);
  pts.push([cx + scale * 0.6, cy]);
  pts.push([cx + scale * 0.6, cy - scale * 0.3 + Math.sin(t + 3) * 4]);
  pts.push([cx + scale * 0.6, cy - scale * 0.55 + Math.sin(t + 3.5) * 4]);
  return pts;
}

export default memo(KeypointOverlay);
