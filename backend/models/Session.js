import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  totalDetections: {
    type: Number,
    default: 0
  },
  avgConfidence: {
    type: Number,
    default: 0
  },
  signsDetected: [{
    sign: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    boundingBox: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  }],
  sentences: [{
    text: {
      type: String,
      required: true
    },
    signs: [{
      sign: String,
      confidence: Number,
      timestamp: Date
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  corrections: [{
    originalText: String,
    correctedText: String,
    feedback: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  practiceMode: {
    type: Boolean,
    default: false
  },
  targetSigns: [String],
  accuracy: {
    type: Number,
    default: 0
  },
  deviceInfo: {
    userAgent: String,
    screenSize: String,
    cameraQuality: String
  }
}, {
  timestamps: true
});

// Calculate session duration when ending session
sessionSchema.methods.endSession = function() {
  this.endTime = new Date();
  this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  return this.save();
};

// Calculate average confidence
sessionSchema.methods.calculateAvgConfidence = function() {
  if (this.signsDetected.length === 0) {
    this.avgConfidence = 0;
    return 0;
  }
  
  const totalConfidence = this.signsDetected.reduce((sum, detection) => sum + detection.confidence, 0);
  this.avgConfidence = totalConfidence / this.signsDetected.length;
  return this.avgConfidence;
};

// Calculate accuracy for practice sessions
sessionSchema.methods.calculateAccuracy = function() {
  if (!this.practiceMode || this.targetSigns.length === 0) {
    this.accuracy = 0;
    return 0;
  }
  
  const correctlyDetected = this.signsDetected.filter(detection => 
    this.targetSigns.includes(detection.sign) && detection.confidence > 0.7
  ).length;
  
  this.accuracy = (correctlyDetected / this.targetSigns.length) * 100;
  return this.accuracy;
};

export default mongoose.model('Session', sessionSchema);
