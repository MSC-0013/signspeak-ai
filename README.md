# SignSpeak AI

Real-time sign language recognition powered by artificial intelligence and TensorFlow.js hand pose detection.

## Features

### Hand Detection
- **Real-time Recognition**: TensorFlow.js MediaPipe-based hand tracking
- **Rule-based Classification**: No ML model required - uses geometric rules
- **Supported Gestures**: FIST, OPEN_HAND, PEACE, POINT, THUMBS_UP
- **Temporal Smoothing**: Stable predictions using 5-frame sliding window
- **8-10 FPS Performance**: Optimized for real-time use

### User Management
- **Authentication**: JWT-based login/register with Google OAuth support
- **Profile Management**: Complete user profiles with preferences
- **Statistics Tracking**: Detection accuracy, session metrics, progress analytics
- **Privacy Controls**: Dark mode, privacy mode, notification preferences

### Session Management
- **Backend Integration**: Full REST API with MongoDB storage
- **Session Tracking**: Automatic session start/end with comprehensive analytics
- **Sentence Building**: Construct sentences from detected signs
- **Correction System**: User feedback and improvement tracking
- **Practice Mode**: Targeted practice with accuracy scoring

### Modern UI
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Themes**: Beautiful theme switching
- **Real-time Metrics**: FPS counter, confidence scores, live detection status
- **Smooth Animations**: Framer Motion powered interactions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Zustand** for state management
- **TailwindCSS** + shadcn/ui for styling
- **TensorFlow.js** + Handpose for hand detection
- **Framer Motion** for animations

### Backend
- **Node.js** + Express.js
- **MongoDB** + Mongoose for database
- **JWT** for authentication
- **Winston** for logging
- **Helmet** + CORS for security

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- Modern browser with camera support

### Installation

1. **Clone and install frontend:**
```bash
git clone <repository>
cd signspeak-ai
npm install
cp .env.example .env
```

2. **Setup backend:**
```bash
cd backend
npm install
cp .env.example .env
# Configure MongoDB URI and JWT secret
```

3. **Start both servers:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd ..
npm run dev
```

4. **Open browser** to `http://localhost:5173`

## Usage

1. **Sign Up/Login**: Create account or use Google OAuth
2. **Start Detection**: Allow camera access and click "Start Detection"
3. **Make Gestures**: Try the supported gestures (FIST, PEACE, POINT, etc.)
4. **Build Sentences**: Detected signs automatically build sentences
5. **View Analytics**: Track your progress in the profile section

## Development

### Project Structure
```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── store/          # Zustand state management
├── utils/          # Utility functions (hand detection)
├── pages/          # Page components

backend/
├── models/         # MongoDB models
├── routes/         # API routes
├── middleware/     # Express middleware
├── utils/          # Backend utilities
```

### Adding New Gestures
Edit `src/utils/handDetection.ts`:
```typescript
const classify = (fingers) => {
  // Add your gesture rules here
  if (/* your condition */) return "YOUR_GESTURE";
  // ... existing rules
};
```

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/detection/session/start` - Start detection session
- `POST /api/detection/session/:id/detect` - Send detection data
- `GET /api/profile` - Get user profile and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Privacy

- All processing happens on-device (client-side)
- Optional backend storage for analytics
- Privacy mode available for sensitive use cases
- No data shared with third parties
