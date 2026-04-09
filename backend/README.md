# SignSpeak AI Backend

A comprehensive backend API for real-time sign language recognition and user management.

## Features

- **User Authentication**: Register, login, and Google OAuth support
- **User Profile Management**: Complete profile with preferences and statistics
- **Detection Sessions**: Real-time sign language detection tracking
- **Session Analytics**: Comprehensive analytics and performance metrics
- **Practice Mode**: Targeted practice sessions with accuracy tracking
- **Sentence Building**: Construct sentences from detected signs
- **Correction System**: User feedback and correction tracking
- **Data Export**: Export user data in JSON format

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Winston** for logging
- **Express Validator** for input validation
- **Helmet** for security
- **Rate Limiting** for API protection

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

5. Make sure MongoDB is running on your system

6. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRE`: JWT expiration time
- `FRONTEND_URL`: Frontend application URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### User Management
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/account` - Delete user account

### Detection Sessions
- `POST /api/detection/session/start` - Start new session
- `POST /api/detection/session/:sessionId/detect` - Add detection
- `POST /api/detection/session/:sessionId/sentence` - Add sentence
- `POST /api/detection/session/:sessionId/correction` - Add correction
- `POST /api/detection/session/:sessionId/end` - End session
- `GET /api/detection/sessions` - Get session history
- `GET /api/detection/session/:sessionId` - Get session details

### Profile
- `GET /api/profile` - Get complete profile
- `GET /api/profile/analytics` - Get analytics data
- `PUT /api/profile/subscription` - Update subscription
- `GET /api/profile/export` - Export user data

## Database Schema

### User Model
- Basic information (name, email, avatar)
- Preferences (dark mode, privacy, notifications)
- Statistics (total detections, sessions, confidence)
- Subscription status

### Session Model
- Session metadata (start/end times, duration)
- Detection data (signs, confidence, timestamps)
- Sentences built from detections
- User corrections and feedback
- Practice mode analytics

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Input validation and sanitization
- Helmet.js for security headers

## Logging

Structured logging with Winston:
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console output in development

## Error Handling

Centralized error handling with:
- Validation error responses
- Database error handling
- JWT error handling
- Consistent error format

## Development

The server includes:
- Hot reload with nodemon
- Environment-based configuration
- Comprehensive logging
- Error handling middleware

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper MongoDB connection
3. Set strong JWT secret
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure monitoring and logging
