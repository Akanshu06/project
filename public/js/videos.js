// DOM elements
const videosContainer = document.getElementById('videos-container');
const loadingSpinner = document.getElementById('loading-spinner');

// API URL
const API_URL = 'http://localhost:3000/api';

// Load videos when the page loads
window.addEventListener('DOMContentLoaded', loadVideos);

// Reload videos when authentication state changes
window.addEventListener('auth:login', loadVideos);
window.addEventListener('auth:logout', loadVideos);

// Function to load videos from API
async function loadVideos() {
  // Show loading spinner
  showLoading(true);
  
  try {
    const response = await fetch(`${API_URL}/videos`);
    const data = await response.json();
    
    if (response.ok) {
      renderVideos(data.data);
    } else {
      window.auth.showAlert('Failed to load videos', 'error');
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    window.auth.showAlert('An error occurred while loading videos', 'error');
  } finally {
    // Hide loading spinner
    showLoading(false);
  }
}

// Function to render videos to the DOM
function renderVideos(videos) {
  // Clear previous videos
  videosContainer.innerHTML = '';
  
  if (!videos || videos.length === 0) {
    videosContainer.innerHTML = '<p class="no-videos">No videos found. Be the first to upload!</p>';
    return;
  }
  
  // Create video cards for each video
  videos.forEach(video => {
    const videoCard = createVideoCard(video);
    videosContainer.appendChild(videoCard);
  });
}

// Function to create a video card element
function createVideoCard(video) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.dataset.id = video._id;
  
  // Create card content
  card.innerHTML = `
    <div class="video-thumbnail">
      <video src="${video.filePath}" poster="" controls></video>
    </div>
    <div class="video-info">
      <h3 class="video-title">${video.title}</h3>
      <div class="video-meta">
        <div class="video-uploader">
          <i class="fas fa-user"></i>
          <span>${video.user ? video.user.username : 'Unknown'}</span>
        </div>
        <div class="like-button${video.liked ? ' active' : ''}" data-id="${video._id}">
          <i class="fas fa-heart"></i>
          <span class="like-count">${video.likes}</span>
        </div>
      </div>
    </div>
  `;
  
  // Add event listener for like button
  const likeButton = card.querySelector('.like-button');
  likeButton.addEventListener('click', (e) => {
    e.preventDefault();
    likeVideo(video._id, likeButton);
  });
  
  return card;
}

// Function to like/unlike a video
async function likeVideo(videoId, likeButton) {
  // Check if user is authenticated
  if (!window.auth.isAuthenticated()) {
    window.auth.showAlert('Please login to like videos', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/videos/like/${videoId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${window.auth.getToken()}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Update like count
      const likeCount = likeButton.querySelector('.like-count');
      likeCount.textContent = data.likes;
      
      // Toggle active class
      if (data.liked) {
        likeButton.classList.add('active');
      } else {
        likeButton.classList.remove('active');
      }
      
      // Add like animation
      likeButton.querySelector('i').classList.add('like-animation');
      setTimeout(() => {
        likeButton.querySelector('i').classList.remove('like-animation');
      }, 500);
    } else {
      window.auth.showAlert(data.error || 'Failed to like video', 'error');
    }
  } catch (error) {
    console.error('Error liking video:', error);
    window.auth.showAlert('An error occurred', 'error');
  }
}

// Helper function to show/hide loading spinner
function showLoading(show) {
  if (show) {
    loadingSpinner.classList.remove('hidden');
  } else {
    loadingSpinner.classList.add('hidden');
  }
}

// Function to get a specific video
async function getVideo(videoId) {
  try {
    const response = await fetch(`${API_URL}/videos/${videoId}`);
    const data = await response.json();
    
    if (response.ok) {
      return data.data;
    } else {
      window.auth.showAlert('Failed to get video details', 'error');
      return null;
    }
  } catch (error) {
    console.error('Error getting video:', error);
    window.auth.showAlert('An error occurred', 'error');
    return null;
  }
}

// Export functions for use in other modules
window.videos = {
  loadVideos,
  getVideo
};