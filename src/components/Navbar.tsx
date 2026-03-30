import { Hand, Sun, Moon, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isDark, toggleTheme } = useAppStore();
  const { user, logout } = useAuthStore();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Hand className="w-4.5 h-4.5 text-primary/70 group-hover:text-primary transition-colors duration-200" />
          <span className="text-sm font-semibold tracking-tight text-foreground/90">
            SignSpeak
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-foreground/80 hover:bg-secondary/30 transition-all duration-200"
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
              <button
                onClick={logout}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground/60 hover:text-foreground/80 hover:bg-secondary/30 transition-all duration-200"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
