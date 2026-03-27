import { memo, useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Activity, Clock, Hash, Target } from 'lucide-react';

function MetricsDisplay() {
  const { metrics, isDetecting } = useAppStore();
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

  const stats = [
    { icon: Hash, label: 'Predictions', value: metrics.totalPredictions },
    { icon: Target, label: 'Avg Confidence', value: `${(metrics.avgConfidence * 100).toFixed(1)}%` },
    { icon: Clock, label: 'Session', value: elapsed },
  ];

  return (
    <div className="flex items-center gap-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{label}:</span>
          <span className="text-xs font-mono font-semibold text-foreground">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default memo(MetricsDisplay);
