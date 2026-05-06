// Geometric sign language classifier using TensorFlow.js Handpose landmarks
// 21 landmarks, deterministic rules only — NO ML classifiers

export interface FingerState {
  extended: boolean;
  curled: boolean;
  straight: boolean;
  angle: number;
}

export interface HandAnalysis {
  fingers: {
    thumb: FingerState;
    index: FingerState;
    middle: FingerState;
    ring: FingerState;
    pinky: FingerState;
  };
  palmCenter: [number, number, number];
  palmNormal: [number, number, number];
  handSize: number;
  landmarks: number[][];
}

export interface GestureResult {
  sign: string;
  emoji: string;
  confidence: number;
  quality: 'high' | 'medium' | 'low';
  state?: 'UNCLEAR' | 'DETECTING' | 'CONFIRMED';
}

export const SIGN_CATALOG: Record<string, { emoji: string; label: string; description: string; category: string }> = {
  THUMBS_UP: {
    emoji: '👍',
    label: 'THUMBS UP',
    category: 'responses',
    description: 'Thumb pointing upward'
  },
  THUMBS_DOWN: {
    emoji: '👎',
    label: 'THUMBS DOWN',
    category: 'responses',
    description: 'Thumb pointing downward'
  },
  PEACE: {
    emoji: '✌️',
    label: 'PEACE',
    category: 'basic',
    description: 'Index and middle fingers extended'
  },
  ROCK: {
    emoji: '🤟',
    label: 'ROCK',
    category: 'basic',
    description: 'Thumb, index, and pinky extended'
  },
  CALL_ME: {
    emoji: '🤙',
    label: 'CALL ME',
    category: 'basic',
    description: 'Thumb and pinky extended'
  },
  OPEN_SPREAD: {
    emoji: '🖐️',
    label: 'OPEN HAND',
    category: 'basic',
    description: 'All fingers spread wide'
  },
  FIST: {
    emoji: '✊',
    label: 'FIST',
    category: 'basic',
    description: 'All fingertips close to palm'
  },
  ONE: {
    emoji: '☝️',
    label: 'ONE',
    category: 'basic',
    description: 'Single index finger'
  },
  STOP: {
    emoji: '✋',
    label: 'STOP',
    category: 'actions',
    description: 'Open palm facing the camera'
  },
  OKAY: {
    emoji: '👌',
    label: 'OKAY',
    category: 'responses',
    description: 'Thumb and index finger touching'
  },
  THREE_SPLIT: {
    emoji: '🖖',
    label: 'THREE SPLIT',
    category: 'basic',
    description: 'Index and middle close, ring and pinky close'
  }
};

// Vector math helpers
function vec3Sub(a: number[], b: number[]): [number, number, number] {
  return [a[0] - b[0], a[1] - b[1], (a[2] || 0) - (b[2] || 0)];
}

function vec3Dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function vec3Len(v: number[]): number {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function vec3Normalize(v: number[]): [number, number, number] {
  const l = vec3Len(v);
  if (l === 0) return [0, 0, 0];
  return [v[0] / l, v[1] / l, v[2] / l];
}

function angleBetween(a: number[], b: number[]): number {
  const na = vec3Normalize(a);
  const nb = vec3Normalize(b);
  const d = Math.max(-1, Math.min(1, vec3Dot(na, nb)));
  return Math.acos(d) * (180 / Math.PI);
}

function dist2D(a: number[], b: number[]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

// Landmark indices
// 0: wrist
// 1-4: thumb (CMC, MCP, IP, TIP)
// 5-8: index (MCP, PIP, DIP, TIP)
// 9-12: middle
// 13-16: ring
// 17-20: pinky

function analyzeFingerAngle(lm: number[][], mcp: number, pip: number, dip: number, tip: number): FingerState {
  const v1 = vec3Sub(lm[pip], lm[mcp]);
  const v2 = vec3Sub(lm[tip], lm[pip]);
  const angle = angleBetween(v1, v2);
  
  const fingerLen = dist2D(lm[mcp], lm[tip]);
  const handSize = dist2D(lm[0], lm[9]);
  const relLen = handSize > 0 ? fingerLen / handSize : 0;

  return {
    extended: angle < 40 && relLen > 0.12,
    curled: angle > 90,
    straight: angle < 25,
    angle,
  };
}

function analyzeThumb(lm: number[][]): FingerState {
  const palmCenter: [number, number] = [
    (lm[0][0] + lm[5][0] + lm[17][0]) / 3,
    (lm[0][1] + lm[5][1] + lm[17][1]) / 3,
  ];
  const thumbTipDist = dist2D(lm[4], palmCenter);
  const handSize = dist2D(lm[0], lm[9]);
  const rel = handSize > 0 ? thumbTipDist / handSize : 0;

  const v1 = vec3Sub(lm[2], lm[1]);
  const v2 = vec3Sub(lm[4], lm[3]);
  const angle = angleBetween(v1, v2);

  return {
    extended: rel > 0.12,
    curled: rel < 0.06,
    straight: angle < 25,
    angle,
  };
}

export function analyzeHand(landmarks: number[][]): HandAnalysis {
  const palmCenter: [number, number, number] = [
    (landmarks[0][0] + landmarks[5][0] + landmarks[9][0] + landmarks[13][0] + landmarks[17][0]) / 5,
    (landmarks[0][1] + landmarks[5][1] + landmarks[9][1] + landmarks[13][1] + landmarks[17][1]) / 5,
    0,
  ];

  const handSize = dist2D(landmarks[0], landmarks[9]);

  return {
    fingers: {
      thumb: analyzeThumb(landmarks),
      index: analyzeFingerAngle(landmarks, 5, 6, 7, 8),
      middle: analyzeFingerAngle(landmarks, 9, 10, 11, 12),
      ring: analyzeFingerAngle(landmarks, 13, 14, 15, 16),
      pinky: analyzeFingerAngle(landmarks, 17, 18, 19, 20),
    },
    palmCenter,
    palmNormal: [0, 0, 1],
    handSize,
    landmarks,
  };
}

export function classifyGesture(analysis: HandAnalysis): GestureResult {
  const { fingers, landmarks, palmCenter } = analysis;
  const { thumb, index, middle, ring, pinky } = fingers;
  const handSize = analysis.handSize;
  const palmWidth = dist2D(landmarks[5], landmarks[17]);

  const extCount = [thumb, index, middle, ring, pinky].filter((f) => f.extended).length;
  const curlCount = [index, middle, ring, pinky].filter((f) => f.curled).length;
  const allExtended = thumb.extended && index.extended && middle.extended && ring.extended && pinky.extended;
  const avgFingertipDistance = [4, 8, 12, 16, 20].reduce((sum, i) => sum + dist2D(landmarks[i], palmCenter), 0) / 5;
  const normalizedTipDistance = palmWidth > 0 ? avgFingertipDistance / palmWidth : 1;
  const thumbIndexDist = dist2D(landmarks[4], landmarks[8]);
  const normalizedThumbIndex = palmWidth > 0 ? thumbIndexDist / palmWidth : 1;
  const indexMiddleDist = dist2D(landmarks[8], landmarks[12]);
  const ringPinkyDist = dist2D(landmarks[16], landmarks[20]);
  const middleRingDist = dist2D(landmarks[12], landmarks[16]);
  const spread = dist2D(landmarks[8], landmarks[20]);
  const relSpread = palmWidth > 0 ? spread / palmWidth : 0;
  const palmRatio = palmWidth / Math.max(1, handSize);

  const normalizeResult = (result: GestureResult): GestureResult => {
    if (result.confidence < 0.88) {
      return { sign: 'UNKNOWN', emoji: '❓', confidence: 0, quality: 'low', state: 'UNCLEAR' };
    }
    return result;
  };

  // Reject side-facing and unstable hands early
  if (palmRatio < 0.40 || handSize < 0.05) {
    return { sign: 'UNKNOWN', emoji: '❓', confidence: 0, quality: 'low', state: 'UNCLEAR' };
  }

  // ---------- FIST ----------
  if (normalizedTipDistance < 0.20 && curlCount >= 3) {
    return normalizeResult({ sign: 'FIST', emoji: '✊', confidence: 0.92, quality: 'high' });
  }

  // ---------- THUMBS UP / THUMBS DOWN ----------
  if (thumb.extended && !index.extended && !middle.extended && !ring.extended && !pinky.extended) {
    if (landmarks[4][1] < landmarks[2][1]) {
      return normalizeResult({ sign: 'THUMBS_UP', emoji: '👍', confidence: 0.93, quality: 'high' });
    }
    if (landmarks[4][1] > landmarks[2][1]) {
      return normalizeResult({ sign: 'BAD', emoji: '👎', confidence: 0.93, quality: 'high' });
    }
  }

  // ---------- CALL_ME ----------
  if (thumb.extended && pinky.extended && !index.extended && !middle.extended && !ring.extended) {
    return normalizeResult({ sign: 'CALL_ME', emoji: '🤙', confidence: 0.92, quality: 'high' });
  }

  // ---------- ROCK ----------
  if (thumb.extended && index.extended && pinky.extended && middle.curled && ring.curled) {
    return normalizeResult({ sign: 'ROCK', emoji: '🤟', confidence: 0.92, quality: 'high' });
  }

  // ---------- THREE_SPLIT ----------
  if (allExtended && indexMiddleDist / palmWidth < 0.28 && ringPinkyDist / palmWidth < 0.28 && middleRingDist / palmWidth > 0.45) {
    return normalizeResult({ sign: 'THREE_SPLIT', emoji: '🖖', confidence: 0.92, quality: 'high' });
  }

  // ---------- OKAY ----------
  if (normalizedThumbIndex < 0.22 && middle.extended && ring.extended && pinky.extended) {
    return normalizeResult({ sign: 'OKAY', emoji: '👌', confidence: 0.92, quality: 'high' });
  }

  // ---------- PEACE ----------
  if (index.extended && middle.extended && !ring.extended && !pinky.extended) {
    return normalizeResult({ sign: 'PEACE', emoji: '✌️', confidence: 0.92, quality: 'high' });
  }

  // ---------- STOP ----------
  if (allExtended && relSpread < 0.58 && thumb.extended) {
    return normalizeResult({ sign: 'STOP', emoji: '✋', confidence: 0.91, quality: 'high' });
  }

  // ---------- ONE ----------
  if (index.extended && !middle.extended && !ring.extended && !pinky.extended && !thumb.extended) {
    return normalizeResult({ sign: 'ONE', emoji: '☝️', confidence: 0.90, quality: 'high' });
  }

  return { sign: 'UNKNOWN', emoji: '❓', confidence: 0, quality: 'low', state: 'UNCLEAR' };
}
