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
}

export const SIGN_CATALOG: Record<string, { emoji: string; description: string; category: string }> = {
  OKAY: { emoji: '👌', description: 'Thumb and index form circle, others extended', category: 'Responses' },
  THANK_YOU: { emoji: '🤝', description: 'Flat hand moves from chin forward', category: 'Greetings' },
  SORRY: { emoji: '🤲', description: 'Fist circles over chest', category: 'Emotions' },
  HELLO: { emoji: '👋', description: 'Open hand wave', category: 'Greetings' },
  YES: { emoji: '👍', description: 'Thumbs up', category: 'Responses' },
  NO: { emoji: '✋', description: 'Open palm facing forward', category: 'Responses' },
  PLEASE: { emoji: '🙏', description: 'Flat hand circles on chest', category: 'Greetings' },
  HELP: { emoji: '🆘', description: 'Fist on open palm, lifted', category: 'Actions' },
  STOP: { emoji: '🛑', description: 'Open palm pushed forward', category: 'Actions' },
  GOOD: { emoji: '👍', description: 'Thumbs up gesture', category: 'Responses' },
  BAD: { emoji: '👎', description: 'Thumbs down gesture', category: 'Emotions' },
  LOVE: { emoji: '❤️', description: 'Cross arms over chest', category: 'Emotions' },
  EAT: { emoji: '🍽️', description: 'Fingers to mouth', category: 'Actions' },
  DRINK: { emoji: '🥤', description: 'C-shape tilted to mouth', category: 'Actions' },
  FRIEND: { emoji: '🤝', description: 'Hook index fingers together', category: 'Greetings' },
  WHERE: { emoji: '❓', description: 'Index finger wag side to side', category: 'Questions' },
  WHAT: { emoji: '❔', description: 'Open palms up, shrug', category: 'Questions' },
  FIST: { emoji: '✊', description: 'All fingers closed', category: 'Actions' },
  OPEN_HAND: { emoji: '🖐️', description: 'All fingers spread open', category: 'Actions' },
  PEACE: { emoji: '✌️', description: 'Index and middle fingers up', category: 'Responses' },
  POINT: { emoji: '👉', description: 'Only index finger extended', category: 'Actions' },
  THUMBS_UP: { emoji: '👍', description: 'Thumb up, fingers closed', category: 'Responses' },
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
  const { fingers, landmarks } = analysis;
  const { thumb, index, middle, ring, pinky } = fingers;
  const handSize = analysis.handSize;

  // Helper counts
  const extCount = [thumb, index, middle, ring, pinky].filter(f => f.extended).length;
  const curlCount = [index, middle, ring, pinky].filter(f => f.curled).length;

  // ---------- FIST ----------
  if (!thumb.extended && curlCount >= 3) {
    return { sign: 'FIST', emoji: '✊', confidence: 0.88 + (curlCount / 20), quality: 'high' };
  }

  // ---------- THUMBS_UP / YES / GOOD ----------
  if (thumb.extended && curlCount >= 3) {
    // Check thumb pointing up (tip.y < mcp.y in screen coords)
    if (landmarks[4][1] < landmarks[2][1]) {
      return { sign: 'THUMBS_UP', emoji: '👍', confidence: 0.90, quality: 'high' };
    }
  }

  // ---------- BAD (thumbs down) ----------
  if (thumb.extended && curlCount >= 3 && landmarks[4][1] > landmarks[2][1]) {
    return { sign: 'BAD', emoji: '👎', confidence: 0.88, quality: 'high' };
  }

  // ---------- POINT ----------
  if (index.extended && !middle.extended && !ring.extended && !pinky.extended) {
    return { sign: 'POINT', emoji: '👉', confidence: 0.89, quality: 'high' };
  }

  // ---------- PEACE ----------
  if (index.extended && middle.extended && !ring.extended && !pinky.extended) {
    return { sign: 'PEACE', emoji: '✌️', confidence: 0.91, quality: 'high' };
  }

  // ---------- OKAY ----------
  if (handSize > 0) {
    const thumbIndexDist = dist2D(landmarks[4], landmarks[8]);
    const relDist = thumbIndexDist / handSize;
    if (relDist < 0.15 && middle.extended && ring.extended && pinky.extended) {
      return { sign: 'OKAY', emoji: '👌', confidence: 0.92, quality: 'high' };
    }
  }

  // ---------- OPEN_HAND / HELLO / STOP / NO ----------
  if (extCount >= 4 && index.extended && middle.extended && ring.extended && pinky.extended) {
    // Spread fingers → OPEN_HAND / HELLO
    const spread = dist2D(landmarks[8], landmarks[20]);
    const relSpread = handSize > 0 ? spread / handSize : 0;
    if (relSpread > 0.8) {
      return { sign: 'HELLO', emoji: '👋', confidence: 0.87, quality: 'high' };
    }
    // Fingers together → STOP / NO
    if (relSpread < 0.6) {
      return { sign: 'STOP', emoji: '🛑', confidence: 0.85, quality: 'medium' };
    }
    return { sign: 'OPEN_HAND', emoji: '🖐️', confidence: 0.86, quality: 'high' };
  }

  // ---------- PLEASE (prayer: all fingers together, tips close) ----------
  if (index.extended && middle.extended && ring.extended && pinky.extended) {
    const tipSpread = dist2D(landmarks[8], landmarks[20]);
    if (handSize > 0 && tipSpread / handSize < 0.35) {
      return { sign: 'PLEASE', emoji: '🙏', confidence: 0.83, quality: 'medium' };
    }
  }

  // ---------- LOVE (index + pinky extended, middle + ring curled) ----------
  if (index.extended && pinky.extended && middle.curled && ring.curled && thumb.extended) {
    return { sign: 'LOVE', emoji: '❤️', confidence: 0.90, quality: 'high' };
  }

  // ---------- EAT (all fingertips near each other, bunched) ----------
  if (handSize > 0) {
    const tips = [4, 8, 12, 16, 20];
    const tipCenter = tips.reduce((a, i) => [a[0] + landmarks[i][0] / 5, a[1] + landmarks[i][1] / 5], [0, 0]);
    const avgDist = tips.reduce((s, i) => s + dist2D(landmarks[i], tipCenter), 0) / 5;
    if (avgDist / handSize < 0.15) {
      return { sign: 'EAT', emoji: '🍽️', confidence: 0.82, quality: 'medium' };
    }
  }

  // ---------- DRINK (C-shape: thumb extended, fingers curled but not tight) ----------
  if (thumb.extended && index.angle > 40 && index.angle < 100 && middle.angle > 40 && middle.angle < 100) {
    return { sign: 'DRINK', emoji: '🥤', confidence: 0.80, quality: 'medium' };
  }

  // ---------- HELP (fist on open palm proxy: tight fist) ----------
  if (curlCount === 4 && thumb.curled) {
    return { sign: 'HELP', emoji: '🆘', confidence: 0.78, quality: 'low' };
  }

  // ---------- SORRY (fist circling — approximated as fist with thumb over) ----------
  if (curlCount >= 3 && thumb.extended && landmarks[4][1] > landmarks[3][1]) {
    return { sign: 'SORRY', emoji: '🤲', confidence: 0.76, quality: 'low' };
  }

  // ---------- FRIEND (hooked index fingers proxy: index partially curled) ----------
  if (index.angle > 40 && index.angle < 90 && middle.curled && ring.curled && pinky.curled) {
    return { sign: 'FRIEND', emoji: '🤝', confidence: 0.75, quality: 'low' };
  }

  // ---------- WHERE (index extended, wagging) ----------
  if (index.extended && !middle.extended && !ring.extended && !pinky.extended && thumb.extended) {
    return { sign: 'WHERE', emoji: '❓', confidence: 0.77, quality: 'medium' };
  }

  // ---------- WHAT (open palms, shrug proxy) ----------
  if (extCount >= 3 && !thumb.extended) {
    return { sign: 'WHAT', emoji: '❔', confidence: 0.74, quality: 'low' };
  }

  // ---------- THANK_YOU (flat hand from chin) ----------
  if (index.extended && middle.extended && ring.extended && pinky.extended && !thumb.extended) {
    return { sign: 'THANK_YOU', emoji: '🤝', confidence: 0.79, quality: 'medium' };
  }

  return { sign: 'UNCLEAR', emoji: '❓', confidence: 0, quality: 'low' };
}