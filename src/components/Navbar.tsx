import { Hand, Sun, Moon, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isDark, toggleTheme, isDetecting } = useAppStore();
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 glass-strong"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors glow-soft">
            <Hand className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            SignSpeak <span className="text-primary/70 font-medium">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {isDetecting && location.pathname === '/detect' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">Live</span>
            </div>
          )}

          <Link
            to="/detect"
            className={`h-8 px-3 rounded-lg text-xs font-medium transition-all flex items-center ${
              isActive('/detect')
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            Detect
          </Link>

          <button
            onClick={toggleTheme}
            className="btn-ghost !px-2"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {user ? (
            <Link to="/profile" className="ml-1">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-xl ring-1 ring-border/30 hover:ring-primary/40 transition-all cursor-pointer"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className="h-8 px-3 rounded-lg text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-all flex items-center gap-1.5 ml-1"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
