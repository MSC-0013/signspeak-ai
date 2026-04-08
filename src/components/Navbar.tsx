import { Hand, Sun, Moon, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isDark, toggleTheme, isDetecting } = useAppStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 glass-strong"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Hand className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground/90">
            SignSpeak <span className="text-primary/60 font-normal">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Active detection indicator */}
          {isDetecting && location.pathname === '/detect' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">Active</span>
            </div>
          )}

          <Link
            to="/detect"
            className="h-8 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all flex items-center"
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

          {user && (
            <>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full ring-1 ring-border/30 ml-1"
              />
              <button onClick={logout} className="btn-ghost !px-2" aria-label="Logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
