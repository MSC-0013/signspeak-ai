import { Hand, Sun, Moon, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isDark, toggleTheme, isDetecting } = useAppStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const isDetectPage = location.pathname === '/detect';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-shadow">
            <Hand className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Sign<span className="text-primary">Speak AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isDetectPage && (
            <div className="flex items-center gap-1.5 mr-2">
              <span className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs text-muted-foreground">{isDetecting ? 'LIVE' : 'Idle'}</span>
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user && (
            <div className="flex items-center gap-2 ml-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-border"
              />
              <button
                onClick={logout}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
