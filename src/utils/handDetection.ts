import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import { analyzeHand, classifyGesture } from './gestureClassifier';
import { SignValidator, type ValidatedResult } from './signValidator';

let model: handpose.HandPose | null = null;
let lastLandmarks: number[][] | null = null;
const validator = new SignValidator();

const computeHandVelocity = (prev: number[][], next: number[][]): number => {
  if (prev.length !== next.length || prev.length === 0) return 0;
  const handSize = Math.max(1, Math.sqrt((next[0][0] - next[9][0]) ** 2 + (next[0][1] - next[9][1]) ** 2));
  const total = prev.reduce((sum, point, i) => {
    const dx = point[0] - next[i][0];
    const dy = point[1] - next[i][1];
    return sum + Math.sqrt(dx * dx + dy * dy);
  }, 0);
  return total / (prev.length * handSize);
};

export const initHandModel = async (): Promise<void> => {
  try {
    await tf.ready();
    model = await handpose.load();
    console.log('Hand pose model loaded successfully');
  } catch (error) {
    console.error('Failed to load hand pose model:', error);
    throw error;
  }
};

export const resetValidator = () => {
  lastLandmarks = null;
  validator.reset();
};

export const detectGesture = async (
  video: HTMLVideoElement
): Promise<ValidatedResult & { landmarks: number[][] | null }> => {
  if (!model) {
    return { sign: 'LOADING', emoji: '⏳', confidence: 0, state: 'UNCLEAR', quality: 'low', stabilityFrames: 0, landmarks: null };
  }

  try {
    const hands = await model.estimateHands(video);

    if (hands.length === 0) {
      return { sign: 'NO_HAND', emoji: '👀', confidence: 0, state: 'UNCLEAR', quality: 'low', stabilityFrames: 0, landmarks: null };
    }

    const landmarks = hands[0].landmarks;
    const handVelocity = lastLandmarks ? computeHandVelocity(lastLandmarks, landmarks) : 0;
    lastLandmarks = landmarks;

    if (handVelocity > 0.15) {
      return {
        sign: 'UNKNOWN',
        emoji: '❓',
        confidence: 0,
        state: 'DETECTING',
        quality: 'low',
        stabilityFrames: 0,
        landmarks,
      };
    }

    const analysis = analyzeHand(landmarks);
    const gesture = classifyGesture(analysis);
    const validated = validator.validate(landmarks, gesture);

    return { ...validated, landmarks };
  } catch (error) {
    console.error('Detection error:', error);
    return { sign: 'ERROR', emoji: '⚠️', confidence: 0, state: 'UNCLEAR', quality: 'low', stabilityFrames: 0, landmarks: null };
  }
};
