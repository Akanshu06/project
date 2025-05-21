const express = require('express');
const { check } = require('express-validator');
const { 
  uploadVideo, 
  getVideos, 
  getVideo, 
  likeVideo,
  getMyVideos
} = require('../controllers/video.controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all videos
router.get('/', getVideos);

// Get single video
router.get('/:id', getVideo);

// Get current user's videos (protected)
router.get('/my/videos', protect, getMyVideos);

// Upload video (protected)
router.post(
  '/upload',
  protect,
  upload.single('video'),
  [
    check('title', 'Title is required').notEmpty()
  ],
  uploadVideo
);

// Like/unlike a video (protected)
router.post('/like/:videoId', protect, likeVideo);

module.exports = router;