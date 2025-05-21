# VibeShare - Video Sharing Platform

A modern video sharing platform with a clean, intuitive interface that supports video uploads, browsing, and likes. This application provides a similar experience to platforms like YouTube or TikTok, but with a simplified feature set.

## Features

- **User Authentication**: JWT-based signup and login system
- **Video Upload**: Upload videos with titles and see upload progress
- **Video Feed**: Browse all uploaded videos with playback controls
- **Like System**: Like/unlike videos (requires authentication)
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Handling**: Multer for video uploads
- **Frontend**: Vanilla JavaScript, CSS with animations

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/videosharingapp
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=30d
   ```
4. Start the server:
   ```
   npm run dev
   ```
5. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (requires auth)

### Videos
- `POST /api/videos/upload` - Upload a video (requires auth)
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get a specific video
- `POST /api/videos/like/:videoId` - Like/unlike a video (requires auth)
- `GET /api/videos/my/videos` - Get current user's videos (requires auth)

## Folder Structure

```
.
├── config/         # Database configuration
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── public/         # Frontend files
│   ├── js/         # JavaScript files
│   └── styles.css  # CSS styles
├── routes/         # API routes
├── uploads/        # Uploaded videos storage
├── .env            # Environment variables
├── package.json    # Dependencies
├── README.md       # Project documentation
└── server.js       # Entry point
```

## Future Enhancements

- User profiles and avatars
- Comments on videos
- Sharing functionality
- Video categories and tags
- Advanced search filters
- Cloud storage integration (Firebase/AWS S3)

## License

This project is licensed under the MIT License