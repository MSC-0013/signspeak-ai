import { memo, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Activity, Clock, Gauge, Zap, TrendingUp } from 'lucide-react';

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
      label: 'Confidence',
      value: `${confidencePct}%`,
      bar: metrics.avgConfidence,
      barColor: 'bg-blue-500/80',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Zap,
      label: 'Latency',
      value: `${latency}ms`,
      bar: Math.min(latency / 100, 1),
      barColor: latency < 60 ? 'bg-emerald-500/80' : 'bg-amber-500/80',
      bgColor: latency < 60 ? 'bg-emerald-500/10' : 'bg-amber-500/10',
    },
    {
      icon: Activity,
      label: 'FPS',
      value: `${fps}`,
      bar: Math.min(fps / 30, 1),
      barColor: 'bg-violet-500/80',
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: Clock,
      label: 'Session',
      value: elapsed,
      bar: 0,
      barColor: '',
      bgColor: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">System Metrics</span>
        </div>
        <motion.div 
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TrendingUp className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-mono font-medium text-foreground">
            {metrics.totalPredictions} detections
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map(({ icon: Icon, label, value, bar, barColor, bgColor }) => (
          <motion.div 
            key={label} 
            className={`${bgColor} rounded-xl p-3 space-y-2.5 border border-white/5 hover:border-white/10 transition-colors`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium">{label}</span>
            </div>
            <p className="text-xl font-bold text-foreground font-mono">{value}</p>
            {bar > 0 && (
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar * 100}%` }}
                  transition={{ duration: 0.6, ease }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default memo(MetricsPanel);
