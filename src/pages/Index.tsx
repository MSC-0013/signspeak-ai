import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, MessageCircle, Hand, Brain, Globe, Mic } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const ease = [0.25, 0.1, 0.25, 1] as const;

const features = [
  { icon: Zap, title: 'Real-Time Detection', desc: 'Sub-100ms gesture recognition powered by deep learning models.' },
  { icon: Target, title: 'High Accuracy', desc: 'Temporal smoothing with 95%+ stable confidence scores.' },
  { icon: MessageCircle, title: 'Instant Translation', desc: 'See translations appear as you sign, with speech output.' },
  { icon: Brain, title: 'Self-Learning', desc: 'Feedback loop lets you correct predictions and improve accuracy.' },
  { icon: Globe, title: 'Multi-Language', desc: 'Translate detected signs into Hindi, Bengali, and more.' },
  { icon: Mic, title: 'Text-to-Speech', desc: 'Built-in TTS converts your sentences into natural speech.' },
];

export default function Index() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 pt-28 pb-24 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/6 blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[120px]" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/40 text-muted-foreground text-sm font-medium mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Sign Language Recognition
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground mb-6">
              Breaking barriers with{' '}
              <span className="text-gradient">real-time AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-12">
              Translate sign language into text and speech instantly. No setup required — just open your camera and start communicating.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
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
                  to="/login"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity glow-primary"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/detect"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl border border-border bg-secondary/50 text-foreground font-medium text-base hover:bg-secondary transition-colors"
                >
                  Try Without Login
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Demo preview */}
      <section className="px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-1.5 glow-soft">
            <div className="bg-secondary/80 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="relative z-10 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  LIVE PREVIEW
                </div>
                <motion.p
                  className="text-5xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  HELLO 👋
                </motion.p>
                <div className="flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
                  <span>Confidence</span>
                  <div className="w-36 h-2 rounded-full bg-background/80 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: '94%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5, ease }}
                    />
                  </div>
                  <span className="font-mono text-primary font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Built for real communication</h2>
            <p className="text-muted-foreground">Every feature designed to make sign language translation seamless.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="glass-card rounded-2xl p-6 group hover:glow-soft transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass-card rounded-3xl p-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Start communicating without barriers
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            No complex setup. Just open your camera, sign, and let AI translate for you in real-time.
          </p>
          <Link
            to={user ? '/detect' : '/login'}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            {user ? 'Open App' : 'Get Started Free'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">SignSpeak AI</span>
          </div>
          <p className="text-[10px] text-muted-foreground/40">© 2026 SignSpeak AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
