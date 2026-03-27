import { memo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { BarChart3 } from 'lucide-react';

function ConfidenceChart() {
  const { predictionHistory } = useAppStore();
  const last10 = predictionHistory.slice(-10);

  const getBarColor = (c: number) => {
    if (c >= 0.9) return 'bg-primary';
    if (c >= 0.7) return 'bg-accent';
    return 'bg-destructive';
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Confidence (Last 10)
        </span>
      </div>
      <div className="flex items-end gap-1 h-16">
        {last10.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No data yet</p>
        ) : (
          last10.map((p, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${getBarColor(p.confidence)}`}
                style={{ height: `${p.confidence * 100}%` }}
                title={`${p.word}: ${(p.confidence * 100).toFixed(0)}%`}
              />
            </div>
          ))
        )}
      </div>
      {last10.length > 0 && (
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> &gt;90%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> 70-90%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> &lt;70%</span>
        </div>
      )}
    </div>
  );
}

export default memo(ConfidenceChart);
