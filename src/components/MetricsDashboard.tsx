import { memo, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Activity, Gauge, Clock, TrendingUp } from 'lucide-react';

function MetricsDashboard() {
  const { fps, metrics, isDetecting } = useAppStore();
  const [elapsed, setElapsed] = useState('0:00');

  useEffect(() => {
    if (!isDetecting) return;
    const iv = setInterval(() => {
      const s = Math.floor((Date.now() - metrics.sessionStart) / 1000);
      const m = Math.floor(s / 60);
      setElapsed(`${m}:${String(s % 60).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(iv);
  }, [isDetecting, metrics.sessionStart]);

  const items = [
    { icon: Activity, label: 'FPS', value: fps.toString(), color: 'text-primary' },
    { icon: Gauge, label: 'Confidence', value: `${(metrics.avgConfidence * 100).toFixed(0)}%`, color: metrics.avgConfidence >= 0.85 ? 'text-emerald-400' : 'text-amber-400' },
    { icon: TrendingUp, label: 'Detections', value: metrics.totalPredictions.toString(), color: 'text-primary' },
    { icon: Clock, label: 'Session', value: elapsed, color: 'text-muted-foreground' },
  ];

  return (
    <div className="glass-card rounded-2xl p-3">
      <span className="panel-label">Metrics</span>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-3">
        {items.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-secondary/20">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className={`text-sm font-semibold font-mono ${color}`}>{value}</span>
            <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MetricsDashboard);