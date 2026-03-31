import { memo, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Activity, Clock, Gauge, Zap } from 'lucide-react';

function MetricsPanel() {
  const { metrics, fps, latency, isDetecting } = useAppStore();
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    if (!isDetecting) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - metrics.sessionStart) / 1000);
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      setElapsed(`${m}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [isDetecting, metrics.sessionStart]);

  const confidencePct = (metrics.avgConfidence * 100).toFixed(1);

  const items = [
    {
      icon: Gauge,
      label: 'Confidence',
      value: `${confidencePct}%`,
      bar: metrics.avgConfidence,
      color: 'bg-primary',
    },
    {
      icon: Zap,
      label: 'Latency',
      value: `${latency}ms`,
      bar: Math.min(latency / 100, 1),
      color: latency < 50 ? 'bg-green-500' : 'bg-yellow-500',
    },
    {
      icon: Activity,
      label: 'FPS',
      value: `${fps}`,
      bar: Math.min(fps / 30, 1),
      color: 'bg-accent',
    },
    {
      icon: Clock,
      label: 'Session',
      value: elapsed,
      bar: 0,
      color: '',
    },
  ];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          System Metrics
        </span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/50">
          {metrics.totalPredictions} detections
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(({ icon: Icon, label, value, bar, color }) => (
          <div key={label} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Icon className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm font-mono font-semibold text-foreground">{value}</p>
            {bar > 0 && (
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MetricsPanel);
