import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";

let model: handpose.HandPose | null = null;
let history: string[] = [];

// ---------- INIT ----------
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

// ---------- NORMALIZE ----------
const normalize = (lm: number[][]): number[][] => {
  const base = lm[0]; // wrist point
  return lm.map(([x, y, z]) => [
    x - base[0],
    y - base[1],
    z
  ]);
};

// ---------- FINGER STATES ----------
const getFingerStates = (lm: number[][]) => {
  // Thumb: Compare thumb tip with thumb MCP
  const thumb = lm[4][0] > lm[2][0];
  
  // Other fingers: Compare finger tip with PIP joint (lower is extended)
  const index = lm[8][1] < lm[6][1];
  const middle = lm[12][1] < lm[10][1];
  const ring = lm[16][1] < lm[14][1];
  const pinky = lm[20][1] < lm[18][1];

  return {
    thumb,
    index,
    middle,
    ring,
    pinky,
  };
};

// ---------- RULE ENGINE ----------
const classify = (fingers: { thumb: boolean; index: boolean; middle: boolean; ring: boolean; pinky: boolean }): string => {
  // FIST: All fingers folded
  if (!fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    return "FIST";
  }
  
  // POINT: Only index finger extended
  if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    return "POINT";
  }
  
  // PEACE: Index and middle fingers extended
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    return "PEACE";
  }
  
  // OPEN_HAND: All fingers extended
  if (fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    return "OPEN_HAND";
  }
  
  // THUMBS_UP: Only thumb extended
  if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    return "THUMBS_UP";
  }

  return "UNKNOWN";
};

// ---------- SMOOTH ----------
const smooth = (prediction: string): string => {
  history.push(prediction);
  if (history.length > 5) {
    history.shift();
  }

  const freq: Record<string, number> = {};
  history.forEach(p => {
    freq[p] = (freq[p] || 0) + 1;
  });

  // Return the most frequent prediction
  return Object.keys(freq).reduce((a, b) =>
    freq[a] > freq[b] ? a : b
  );
};

// ---------- DETECTION ----------
export const detectGesture = async (video: HTMLVideoElement): Promise<{ sign: string; confidence: number }> => {
  if (!model) {
    return { sign: "LOADING", confidence: 0 };
  }

  try {
    const hands = await model.estimateHands(video);

    if (hands.length === 0) {
      return { sign: "NO_HAND", confidence: 0 };
    }

    const landmarks = normalize(hands[0].landmarks);
    const fingerStates = getFingerStates(landmarks);
    const rawPrediction = classify(fingerStates);
    const stablePrediction = smooth(rawPrediction);

    // Higher confidence if prediction is stable
    const confidence = stablePrediction === rawPrediction ? 0.9 : 0.7;

    return {
      sign: stablePrediction,
      confidence
    };
  } catch (error) {
    console.error('Detection error:', error);
    return { sign: "ERROR", confidence: 0 };
  }
};

// ---------- BACKEND CONNECTION ----------
export const sendDetection = async (sessionId: string, sign: string, confidence: number): Promise<void> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${API_BASE_URL}/detection/session/${sessionId}/detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''}`
      },
      body: JSON.stringify({
        sign,
        confidence
      })
    });

    if (!response.ok) {
      console.error('Failed to send detection to backend:', await response.text());
    }
  } catch (error) {
    console.error('Error sending detection to backend:', error);
  }
};

// ---------- SESSION MANAGEMENT ----------
export const startDetectionSession = async (practiceMode: boolean = false, targetSigns: string[] = []): Promise<string | null> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${API_BASE_URL}/detection/session/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''}`
      },
      body: JSON.stringify({
        practiceMode,
        targetSigns,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        cameraQuality: 'unknown'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.session.id;
    } else {
      console.error('Failed to start detection session:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error starting detection session:', error);
    return null;
  }
};

export const endDetectionSession = async (sessionId: string): Promise<void> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${API_BASE_URL}/detection/session/${sessionId}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''}`
      }
    });

    if (!response.ok) {
      console.error('Failed to end detection session:', await response.text());
    }
  } catch (error) {
    console.error('Error ending detection session:', error);
  }
};
