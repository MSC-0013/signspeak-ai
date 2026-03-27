import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Volume2, Brain, Hand } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-Time Detection',
    description: 'Instant hand gesture recognition with sub-second latency.',
  },
  {
    icon: Volume2,
    title: 'Speech Output',
    description: 'Automatically converts detected signs into spoken words.',
  },
  {
    icon: Brain,
    title: 'High Accuracy AI',
    description: 'State-of-the-art deep learning model for precise predictions.',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Hand className="w-4 h-4" />
              AI-Powered Sign Language
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground mb-5">
              Real-Time Sign Language{' '}
              <span className="text-gradient">Translator</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Breaking communication barriers with AI. Detect hand gestures instantly and convert them to text and speech.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/detect"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity glow-primary"
            >
              Start Translating
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass rounded-2xl p-6 group hover:glow-primary transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
