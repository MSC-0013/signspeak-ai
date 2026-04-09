import express from 'express';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { protect } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get complete user profile with stats
// @route   GET /api/profile
// @access  Private
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get recent sessions
    const recentSessions = await Session.find({ user: req.user.id })
      .sort({ startTime: -1 })
      .limit(5)
      .select('startTime endTime duration totalDetections avgConfidence accuracy');

    // Get session history for corrections
    const sessionHistory = await Session.find({ 
      user: req.user.id,
      corrections: { $exists: true, $ne: [] }
    })
      .sort({ startTime: -1 })
      .select('corrections startTime');

    // Flatten all corrections
    const corrections = sessionHistory.reduce((all, session) => {
      return all.concat(session.corrections.map(correction => ({
        ...correction.toObject(),
        sessionId: session._id,
        sessionDate: session.startTime
      })));
    }, []);

    res.json({
      success: true,
      profile: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscription: user.subscription,
          preferences: user.preferences,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        stats: user.stats,
        recentSessions,
        corrections: corrections.slice(0, 20), // Limit to recent 20 corrections
        sessionHistory: recentSessions.map(s => ({
          id: s._id,
          date: s.startTime,
          duration: s.duration,
          detections: s.totalDetections,
          confidence: s.avgConfidence
        }))
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @desc    Get user analytics data
// @route   GET /api/profile/analytics
// @access  Private
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get sessions in the period
    const sessions = await Session.find({
      user: req.user.id,
      startTime: { $gte: startDate }
    }).sort({ startTime: 1 });

    // Calculate daily stats
    const dailyStats = {};
    const signFrequency = {};

    sessions.forEach(session => {
      const date = session.startTime.toISOString().split('T')[0];
      
      if (!dailyStats[date]) {
        dailyStats[date] = {
          sessions: 0,
          totalDetections: 0,
          totalDuration: 0,
          avgConfidence: 0,
          confidenceSum: 0
        };
      }

      dailyStats[date].sessions++;
      dailyStats[date].totalDetections += session.totalDetections;
      dailyStats[date].totalDuration += session.duration;
      dailyStats[date].confidenceSum += session.avgConfidence;

      // Count sign frequency
      session.signsDetected.forEach(detection => {
        signFrequency[detection.sign] = (signFrequency[detection.sign] || 0) + 1;
      });
    });

    // Calculate average confidence per day
    Object.keys(dailyStats).forEach(date => {
      const stats = dailyStats[date];
      stats.avgConfidence = stats.sessions > 0 ? stats.confidenceSum / stats.sessions : 0;
      delete stats.confidenceSum;
    });

    // Get top signs
    const topSigns = Object.entries(signFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([sign, count]) => ({ sign, count }));

    // Calculate improvement metrics
    const totalSessions = sessions.length;
    const avgSessionDuration = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length 
      : 0;
    const avgConfidence = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.avgConfidence, 0) / sessions.length
      : 0;

    res.json({
      success: true,
      analytics: {
        period: days,
        summary: {
          totalSessions,
          avgSessionDuration: Math.round(avgSessionDuration),
          avgConfidence: Math.round(avgConfidence * 100) / 100,
          totalDetections: sessions.reduce((sum, s) => sum + s.totalDetections, 0)
        },
        dailyStats,
        topSigns,
        practiceAccuracy: sessions.filter(s => s.practiceMode).reduce((sum, s) => sum + s.accuracy, 0) / sessions.filter(s => s.practiceMode).length || 0
      }
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @desc    Update subscription
// @route   PUT /api/profile/subscription
// @access  Private
router.put('/subscription', async (req, res) => {
  try {
    const { subscription } = req.body;
    
    if (!['free', 'pro'].includes(subscription)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription type'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subscription },
      { new: true, runValidators: true }
    );

    logger.info(`Subscription updated: ${user.email} -> ${subscription}`);

    res.json({
      success: true,
      subscription: user.subscription
    });
  } catch (error) {
    logger.error('Subscription update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during subscription update'
    });
  }
});

// @desc    Export user data
// @route   GET /api/profile/export
// @access  Private
router.get('/export', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const sessions = await Session.find({ user: req.user.id })
      .sort({ startTime: -1 });

    const exportData = {
      user: {
        name: user.name,
        email: user.email,
        subscription: user.subscription,
        stats: user.stats,
        createdAt: user.createdAt
      },
      sessions: sessions.map(session => ({
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        totalDetections: session.totalDetections,
        avgConfidence: session.avgConfidence,
        accuracy: session.accuracy,
        practiceMode: session.practiceMode,
        sentencesCount: session.sentences.length,
        correctionsCount: session.corrections.length
      })),
      exportedAt: new Date()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="signspeak-data-${user.email}-${Date.now()}.json"`);
    
    logger.info(`Data exported for user: ${user.email}`);

    res.json(exportData);
  } catch (error) {
    logger.error('Data export error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during data export'
    });
  }
});

export default router;
