import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Camera, Clock, Target, BarChart3, Settings2, ChevronRight, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { metrics, corrections, sessionHistory, isDark, toggleTheme, privacyMode, togglePrivacyMode } = useAppStore();

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const stats = [
    { icon: Camera, label: 'Total Detections', value: metrics.totalPredictions.toLocaleString(), color: 'text-primary' },
    { icon: Target, label: 'Avg. Confidence', value: `${(metrics.avgConfidence * 100).toFixed(1)}%`, color: 'text-accent' },
    { icon: Clock, label: 'Sessions', value: sessionHistory.length.toString(), color: 'text-primary' },
    { icon: BarChart3, label: 'Corrections', value: corrections.length.toString(), color: 'text-accent' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Profile card */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl ring-2 ring-primary/20"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-foreground truncate">{user.name}</h1>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                  Pro User
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, ease }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Settings */}
        <div className="glass-card rounded-2xl divide-y divide-border/50">
          <h2 className="px-6 py-4 text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            Settings
          </h2>

          {/* Dark mode */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
          >
            <span className="text-sm text-foreground">Dark Mode</span>
            <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${isDark ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Privacy mode */}
          <button
            onClick={togglePrivacyMode}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Privacy Mode</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${privacyMode ? 'bg-primary' : 'bg-muted'}`}>
              <div className={`w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${privacyMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Open detect */}
          <button
            onClick={() => navigate('/detect')}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
          >
            <span className="text-sm text-foreground">Open Detection</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </motion.div>
    </div>
  );
}
