import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  avatar: {
    type: String,
    default: function() {
      return `https://api.dicebear.com/9.x/notionists/svg?seed=${this.email}`;
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  subscription: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    privacyMode: {
      type: Boolean,
      default: false
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalDetections: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    avgConfidence: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Update user stats
userSchema.methods.updateStats = function(sessionData) {
  this.stats.totalDetections += sessionData.detections || 0;
  this.stats.totalSessions += 1;
  this.stats.totalTimeSpent += sessionData.duration || 0;
  
  // Calculate average confidence
  if (this.stats.totalDetections > 0) {
    this.stats.avgConfidence = (
      (this.stats.avgConfidence * (this.stats.totalDetections - sessionData.detections) + 
       (sessionData.avgConfidence * sessionData.detections)) / 
      this.stats.totalDetections
    );
  }
  
  return this.save();
};

export default mongoose.model('User', userSchema);
