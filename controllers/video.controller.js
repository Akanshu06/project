const Video = require('../models/Video');
const Like = require('../models/Like');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

// @desc    Upload video
// @route   POST /api/videos/upload
// @access  Private
exports.uploadVideo = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Get title from request
    const { title } = req.body;

    // Make sure file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a video file'
      });
    }

    // Create video record
    const video = await Video.create({
      title,
      filename: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    // Cleanup if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
exports.getVideos = async (req, res, next) => {
  try {
    // Query videos and populate user information
    const videos = await Video.find()
      .populate({
        path: 'user',
        select: 'username'
      })
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate({
      path: 'user',
      select: 'username'
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a video
// @route   POST /api/videos/like/:videoId
// @access  Private
exports.likeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    // Check if user already liked this video
    const existingLike = await Like.findOne({
      video: videoId,
      user: req.user.id
    });

    if (existingLike) {
      // User already liked this video, so unlike it
      await Like.findByIdAndDelete(existingLike._id);
      
      // Decrement video likes count
      video.likes = Math.max(0, video.likes - 1);
      await video.save();

      return res.status(200).json({
        success: true,
        message: 'Video unliked successfully',
        liked: false,
        likes: video.likes
      });
    }

    // Create new like
    await Like.create({
      video: videoId,
      user: req.user.id
    });

    // Increment video likes count
    video.likes += 1;
    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video liked successfully',
      liked: true,
      likes: video.likes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my videos
// @route   GET /api/videos/my
// @access  Private
exports.getMyVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    next(error);
  }
};