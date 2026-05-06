// Anti-hallucination validation system

import type { GestureResult } from './gestureClassifier';

const HISTORY_SIZE = 10;
const STABILITY_THRESHOLD = 10;
const DEBOUNCE_MS = 700;
const CONFIDENCE_BOOST_PER_FRAME = 0.02;
const MAX_CONFIDENCE = 0.99;
const MIN_LANDMARKS = 16;

export type DetectionState = 'UNCLEAR' | 'DETECTING' | 'CONFIRMED';

export interface ValidatedResult {
  sign: string;
  emoji: string;
  confidence: number;
  state: DetectionState;
  quality: 'high' | 'medium' | 'low';
  stabilityFrames: number;
}

export class SignValidator {
  private history: GestureResult[] = [];
  private lastConfirmed: { sign: string; time: number } = { sign: '', time: 0 };
  private stabilityCount = 0;
  private currentCandidate = '';

  reset() {
    this.history = [];
    this.lastConfirmed = { sign: '', time: 0 };
    this.stabilityCount = 0;
    this.currentCandidate = '';
  }

  validate(landmarks: number[][], gesture: GestureResult): ValidatedResult {
    // Layer 1: Landmark quality
    if (landmarks.length < MIN_LANDMARKS) {
      this.stabilityCount = 0;
      this.currentCandidate = '';
      return { sign: 'UNCLEAR', emoji: '❓', confidence: 0, state: 'UNCLEAR', quality: 'low', stabilityFrames: 0 };
    }

    // Layer 2: Reject UNCLEAR
    if (gesture.sign === 'UNCLEAR' || gesture.confidence < 0.7) {
      this.stabilityCount = Math.max(0, this.stabilityCount - 1);
      return { sign: gesture.sign, emoji: gesture.emoji, confidence: gesture.confidence, state: 'UNCLEAR', quality: gesture.quality, stabilityFrames: this.stabilityCount };
    }

    // Push to history
    this.history.push(gesture);
    if (this.history.length > HISTORY_SIZE) this.history.shift();

    // Layer 3: Temporal stability
    if (gesture.sign === this.currentCandidate) {
      this.stabilityCount++;
    } else {
      this.currentCandidate = gesture.sign;
      this.stabilityCount = 1;
    }

    // Layer 5: Confidence boosting
    let boostedConfidence = Math.min(
      MAX_CONFIDENCE,
      gesture.confidence + this.stabilityCount * CONFIDENCE_BOOST_PER_FRAME
    );

    // Not yet stable
    if (this.stabilityCount < STABILITY_THRESHOLD) {
      return {
        sign: gesture.sign,
        emoji: gesture.emoji,
        confidence: boostedConfidence,
        state: 'DETECTING',
        quality: gesture.quality,
        stabilityFrames: this.stabilityCount,
      };
    }

    // Layer 4: Debounce
    const now = Date.now();
    if (gesture.sign === this.lastConfirmed.sign && now - this.lastConfirmed.time < DEBOUNCE_MS) {
      return {
        sign: gesture.sign,
        emoji: gesture.emoji,
        confidence: boostedConfidence,
        state: 'DETECTING',
        quality: gesture.quality,
        stabilityFrames: this.stabilityCount,
      };
    }

    // CONFIRMED
    this.lastConfirmed = { sign: gesture.sign, time: now };
    this.stabilityCount = 0;

    return {
      sign: gesture.sign,
      emoji: gesture.emoji,
      confidence: boostedConfidence,
      state: 'CONFIRMED',
      quality: gesture.quality,
      stabilityFrames: STABILITY_THRESHOLD,
    };
  }
}