import express from 'express';
import { body, validationResult } from 'express-validator';
import Session from '../models/Session.js';
import { protect } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Start a new detection session
// @route   POST /api/detection/session/start
// @access  Private
router.post('/session/start', [
  body('practiceMode').optional().isBoolean(),
  body('targetSigns').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { practiceMode = false, targetSigns = [] } = req.body;

    const session = await Session.create({
      user: req.user.id,
      practiceMode,
      targetSigns,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        screenSize: req.body.screenSize || 'unknown',
        cameraQuality: req.body.cameraQuality || 'unknown'
      }
    });

    logger.info(`Detection session started: ${session._id} for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      session: {
        id: session._id,
        startTime: session.startTime,
        practiceMode: session.practiceMode,
        targetSigns: session.targetSigns
      }
    });
  } catch (error) {
    logger.error('Session start error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during session start'
    });
  }
});

// @desc    Add detection data to session
// @route   POST /api/detection/session/:sessionId/detect
// @access  Private
router.post('/session/:sessionId/detect', [
  body('sign').notEmpty().withMessage('Sign is required'),
  body('confidence').isFloat({ min: 0, max: 1 }).withMessage('Confidence must be between 0 and 1'),
  body('boundingBox').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { sign, confidence, boundingBox } = req.body;
    const { sessionId } = req.params;

    const session = await Session.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Add detection
    session.signsDetected.push({
      sign,
      confidence,
      timestamp: new Date(),
      boundingBox
    });

    session.totalDetections = session.signsDetected.length;
    await session.calculateAvgConfidence();
    await session.save();

    res.json({
      success: true,
      detection: {
        sign,
        confidence,
        timestamp: new Date()
      },
      sessionStats: {
        totalDetections: session.totalDetections,
        avgConfidence: session.avgConfidence
      }
    });
  } catch (error) {
    logger.error('Detection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during detection'
    });
  }
});

// @desc    Add sentence to session
// @route   POST /api/detection/session/:sessionId/sentence
// @access  Private
router.post('/session/:sessionId/sentence', [
  body('text').trim().notEmpty().withMessage('Sentence text is required'),
  body('signs').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { text, signs = [] } = req.body;
    const { sessionId } = req.params;

    const session = await Session.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.sentences.push({
      text,
      signs,
      createdAt: new Date()
    });

    await session.save();

    res.json({
      success: true,
      sentence: {
        text,
        signs,
        createdAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Sentence addition error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during sentence addition'
    });
  }
});

// @desc    Add correction to session
// @route   POST /api/detection/session/:sessionId/correction
// @access  Private
router.post('/session/:sessionId/correction', [
  body('originalText').trim().notEmpty().withMessage('Original text is required'),
  body('correctedText').trim().notEmpty().withMessage('Corrected text is required'),
  body('feedback').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { originalText, correctedText, feedback } = req.body;
    const { sessionId } = req.params;

    const session = await Session.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.corrections.push({
      originalText,
      correctedText,
      feedback,
      timestamp: new Date()
    });

    await session.save();

    res.json({
      success: true,
      correction: {
        originalText,
        correctedText,
        feedback,
        timestamp: new Date()
      }
    });
  } catch (error) {
    logger.error('Correction addition error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during correction addition'
    });
  }
});

// @desc    End detection session
// @route   POST /api/detection/session/:sessionId/end
// @access  Private
router.post('/session/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ _id: sessionId, user: req.user.id });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await session.endSession();
    await session.calculateAccuracy();

    // Update user stats
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user.id);
    await user.updateStats({
      detections: session.totalDetections,
      avgConfidence: session.avgConfidence,
      duration: session.duration
    });

    logger.info(`Detection session ended: ${session._id} for user ${req.user.email}`);

    res.json({
      success: true,
      session: {
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        totalDetections: session.totalDetections,
        avgConfidence: session.avgConfidence,
        accuracy: session.accuracy,
        sentencesCount: session.sentences.length,
        correctionsCount: session.corrections.length
      }
    });
  } catch (error) {
    logger.error('Session end error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during session end'
    });
  }
});

// @desc    Get session history
// @route   GET /api/detection/sessions
// @access  Private
router.get('/sessions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sessions = await Session.find({ user: req.user.id })
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit)
      .select('startTime endTime duration totalDetections avgConfidence accuracy practiceMode');

    const total = await Session.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions'
    });
  }
});

// @desc    Get specific session details
// @route   GET /api/detection/session/:sessionId
// @access  Private
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ _id: sessionId, user: req.user.id })
      .populate('user', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    logger.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session'
    });
  }
});

export default router;
