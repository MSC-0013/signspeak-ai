import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hand, Loader2, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';

const ease = [0.25, 0.1, 0.25, 1] as const;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function Login() {
  const { user, loginWithGoogle, isLoading, setLoading } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) navigate('/detect', { replace: true });
  }, [user, navigate]);

  // Handle real Google Sign-In credential response
  const handleGoogleCredentialResponse = useCallback(async (response: any) => {
    try {
      setLoading(true);
      
      // response.credential is the JWT ID token from Google
      const idToken = response.credential;
      
      // Send ID token to backend for verification
      await loginWithGoogle(idToken);
      
      toast({
        title: 'Welcome!',
        description: 'Successfully signed in with Google',
      });
      
      navigate('/detect');
    } catch (error) {
      console.error('Google login failed:', error);
      toast({
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [loginWithGoogle, navigate, setLoading, toast]);

  // Initialize Google Identity Services
  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 400,
        text: 'continue_with',
        logo_alignment: 'left',
      });
    }
  }, [handleGoogleCredentialResponse]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[140px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-accent/6 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card rounded-3xl p-10 space-y-8">
          {/* Logo & branding */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 glow-soft mx-auto"
            >
              <Hand className="w-8 h-8 text-primary" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Welcome to <span className="text-gradient">SignSpeak AI</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Real-time sign language recognition powered by artificial intelligence
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: Zap, text: 'Real-time gesture detection at 20+ FPS' },
              { icon: Shield, text: 'Privacy-first — all processing on-device' },
              { icon: Sparkles, text: 'AI-powered with 95%+ accuracy' },
            ].map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, ease }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-secondary/40"
              >
                <f.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">{f.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Google Sign-In Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, ease }}
            className="space-y-3"
          >
            {/* Real Google Sign-In Button */}
            <div 
              ref={googleButtonRef}
              className="w-full"
              style={{ height: '44px' }}
            />
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </div>
            )}
          </motion.div>

          {/* Terms */}
          <p className="text-[10px] text-muted-foreground/40 text-center leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
