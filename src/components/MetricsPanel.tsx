import { memo, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Activity, Clock, Gauge, Zap } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1] as const;

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
      label: 'Avg Confidence',
      value: `${confidencePct}%`,
      bar: metrics.avgConfidence,
      barColor: 'bg-primary',
    },
    {
      icon: Zap,
      label: 'Latency',
      value: `${latency}ms`,
      bar: Math.min(latency / 100, 1),
      barColor: latency < 60 ? 'bg-[hsl(var(--success))]' : 'bg-[hsl(var(--warning))]',
    },
    {
      icon: Activity,
      label: 'FPS',
      value: `${fps}`,
      bar: Math.min(fps / 30, 1),
      barColor: 'bg-accent',
    },
    {
      icon: Clock,
      label: 'Session',
      value: elapsed,
      bar: 0,
      barColor: '',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="panel-header !mb-0">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="panel-label">System Metrics</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/40">
          {metrics.totalPredictions} detections
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, label, value, bar, barColor }) => (
          <div key={label} className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Icon className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-base font-mono font-semibold text-foreground tabular-nums">{value}</p>
            {bar > 0 && (
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar * 100}%` }}
                  transition={{ duration: 0.5, ease }}
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
