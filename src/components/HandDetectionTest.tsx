import { useState, useEffect } from 'react';
import { detectGesture, initHandModel } from '@/utils/handDetection';

export default function HandDetectionTest() {
  const [status, setStatus] = useState('Loading...');
  const [predictions, setPredictions] = useState<string[]>([]);

  useEffect(() => {
    const testDetection = async () => {
      try {
        setStatus('Initializing model...');
        await initHandModel();
        
        setStatus('Model loaded! Testing with mock video...');
        
        // Create a mock video element for testing
        const video = document.createElement('video');
        video.width = 640;
        video.height = 480;
        
        // Test detection (will return NO_HAND since no real video)
        const result = await detectGesture(video);
        setPredictions([`Sign: ${result.sign}, Confidence: ${result.confidence}`]);
        setStatus('Test completed successfully!');
      } catch (error) {
        setStatus(`Error: ${error.message}`);
        setPredictions([`Error: ${error.message}`]);
      }
    };

    testDetection();
  }, []);

  return (
    <div className="p-4 bg-card rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Hand Detection Test</h3>
      <p className="text-sm text-muted-foreground mb-2">{status}</p>
      {predictions.length > 0 && (
        <div className="space-y-1">
          {predictions.map((pred, i) => (
            <p key={i} className="text-xs font-mono bg-muted p-2 rounded">{pred}</p>
          ))}
        </div>
      )}
    </div>
  );
}
