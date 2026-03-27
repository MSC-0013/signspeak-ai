import { motion } from 'framer-motion';
import CameraFeed from '@/components/CameraFeed';
import PredictionPanel from '@/components/PredictionPanel';
import ControlsBar from '@/components/ControlsBar';

export default function Detect() {
  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">Detection Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Position your hands in front of the camera to begin translating
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-5 mb-5">
          <div className="lg:col-span-3">
            <CameraFeed />
          </div>
          <div className="lg:col-span-2 min-h-[300px]">
            <PredictionPanel />
          </div>
        </div>

        <ControlsBar />
      </div>
    </div>
  );
}
