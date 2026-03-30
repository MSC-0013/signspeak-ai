import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, MessageCircle, Hand, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const features = [
  { icon: Zap, title: 'Real-Time Detection', desc: 'Sub-second gesture recognition powered by deep learning.' },
  { icon: Target, title: 'High Accuracy', desc: 'State-of-the-art model with 95%+ confidence scores.' },
  { icon: MessageCircle, title: 'Instant Feedback', desc: 'See translations appear as you sign, with speech output.' },
];

export default function Index() {
  const { login, isLoading, user } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await login();
    navigate('/detect');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-muted-foreground text-sm font-medium mb-8">
              <Hand className="w-4 h-4 text-primary" />
              AI-Powered Sign Language
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground mb-6">
              Real-Time Sign Language{' '}
              <span className="text-gradient">Recognition</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
              Translate gestures into text instantly using AI. Breaking communication barriers, one sign at a time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {user ? (
              <Link
                to="/detect"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity glow-primary"
              >
                Open App
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/detect"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity glow-primary"
                >
                  Start Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl border border-border bg-secondary/60 text-foreground font-medium text-base hover:bg-secondary transition-colors disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
                </button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Mock Demo */}
      <section className="px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass rounded-2xl p-1 glow-primary">
            <div className="bg-secondary rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  LIVE DEMO
                </div>
                <motion.p
                  className="text-4xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  HELLO 👋
                </motion.p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>Confidence:</span>
                  <div className="w-32 h-2 rounded-full bg-background overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: '94%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="font-mono text-primary">94%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 group hover:glow-primary transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass rounded-2xl p-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Start communicating without barriers
          </h2>
          <p className="text-muted-foreground mb-8">
            No setup required. Just open your camera and start signing.
          </p>
          <Link
            to="/detect"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
