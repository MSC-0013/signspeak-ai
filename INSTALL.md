# SignSpeak AI Installation Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and set VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
# Important: Set a strong JWT_SECRET and your MongoDB URI
```

4. Create logs directory:
```bash
mkdir logs
```

5. Start the backend server:
```bash
npm run dev
```

## TensorFlow.js Hand Detection

The application uses TensorFlow.js for hand pose detection. The models are loaded automatically when you start the application.

**Supported Gestures:**
- FIST
- OPEN_HAND
- PEACE
- POINT
- THUMBS_UP

**Detection Features:**
- Real-time hand tracking at 8-10 FPS
- Temporal smoothing for stable predictions
- Confidence scoring (0.7-0.95)
- Automatic session tracking with backend

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/signspeak-ai
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### TensorFlow.js Issues
- Ensure you have a modern browser with WebGL support
- Check browser console for model loading errors
- Some browsers may require HTTPS for camera access

### Backend Issues
- Verify MongoDB is running and accessible
- Check that all environment variables are set
- Ensure ports 5000 (backend) and 5173 (frontend) are available

### Camera Issues
- Grant camera permissions when prompted
- Ensure good lighting for best detection
- Keep hand clearly visible in camera frame

## Development Notes

- The hand detection runs at ~8-10 FPS to balance performance and accuracy
- Predictions are smoothed over 5 frames to reduce flicker
- Sessions are automatically tracked in the backend
- All detections are logged for analytics and improvement

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure MongoDB with proper authentication
4. Set up reverse proxy (nginx)
5. Enable HTTPS
6. Configure monitoring and logging
