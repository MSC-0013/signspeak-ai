import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import { analyzeHand, classifyGesture } from './gestureClassifier';
import { SignValidator, type ValidatedResult } from './signValidator';

let model: handpose.HandPose | null = null;
const validator = new SignValidator();

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

export const resetValidator = () => validator.reset();

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
    const analysis = analyzeHand(landmarks);
    const gesture = classifyGesture(analysis);
    const validated = validator.validate(landmarks, gesture);

    return { ...validated, landmarks };
  } catch (error) {
    console.error('Detection error:', error);
    return { sign: 'ERROR', emoji: '⚠️', confidence: 0, state: 'UNCLEAR', quality: 'low', stabilityFrames: 0, landmarks: null };
  }
};
