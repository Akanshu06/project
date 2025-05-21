// DOM elements
const uploadBtn = document.getElementById('upload-btn');
const uploadModal = document.getElementById('upload-modal');
const closeUpload = document.getElementById('close-upload');
const uploadForm = document.getElementById('upload-form');
const uploadProgress = document.getElementById('upload-progress');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// API URL
const API_URL = 'http://localhost:3000/api';

// Event listeners
uploadBtn.addEventListener('click', () => {
  if (!window.auth.isAuthenticated()) {
    window.auth.showAlert('Please login to upload videos', 'error');
    return;
  }
  showModal(uploadModal);
});

closeUpload.addEventListener('click', () => {
  hideModal(uploadModal);
  resetUploadForm();
});

window.addEventListener('click', (e) => {
  if (e.target === uploadModal) {
    hideModal(uploadModal);
    resetUploadForm();
  }
});

uploadForm.addEventListener('submit', uploadVideo);

// Show/hide modal functions
function showModal(modal) {
  modal.classList.add('active');
}

function hideModal(modal) {
  modal.classList.remove('active');
}

// Function to upload video
async function uploadVideo(e) {
  e.preventDefault();
  
  // Check if user is authenticated
  if (!window.auth.isAuthenticated()) {
    window.auth.showAlert('Please login to upload videos', 'error');
    return;
  }
  
  const title = document.getElementById('video-title').value;
  const videoFile = document.getElementById('video-file').files[0];
  
  if (!title || !videoFile) {
    window.auth.showAlert('Please provide both title and video file', 'error');
    return;
  }
  
  // Validate file type
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
  if (!validTypes.includes(videoFile.type)) {
    window.auth.showAlert('Please upload a valid video file (MP4, WebM, OGG, MOV, AVI)', 'error');
    return;
  }
  
  // Validate file size (100MB max)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (videoFile.size > maxSize) {
    window.auth.showAlert('Video file is too large. Maximum size is 100MB', 'error');
    return;
  }
  
  // Show progress UI
  uploadProgress.classList.remove('hidden');
  
  // Create form data
  const formData = new FormData();
  formData.append('title', title);
  formData.append('video', videoFile);
  
  try {
    // Use XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = `${percentComplete}%`;
        progressText.textContent = `${percentComplete}%`;
      }
    });
    
    xhr.addEventListener('load', function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        window.auth.showAlert('Video uploaded successfully', 'success');
        
        // Reset form and hide modal
        resetUploadForm();
        hideModal(uploadModal);
        
        // Reload videos
        window.videos.loadVideos();
      } else {
        let errorMsg = 'Upload failed';
        try {
          const response = JSON.parse(xhr.responseText);
          errorMsg = response.error || errorMsg;
        } catch (e) {}
        
        window.auth.showAlert(errorMsg, 'error');
        uploadProgress.classList.add('hidden');
      }
    });
    
    xhr.addEventListener('error', function() {
      window.auth.showAlert('An error occurred during upload', 'error');
      uploadProgress.classList.add('hidden');
    });
    
    xhr.open('POST', `${API_URL}/videos/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${window.auth.getToken()}`);
    xhr.send(formData);
  } catch (error) {
    console.error('Error uploading video:', error);
    window.auth.showAlert('An error occurred', 'error');
    uploadProgress.classList.add('hidden');
  }
}

// Function to reset upload form
function resetUploadForm() {
  uploadForm.reset();
  uploadProgress.classList.add('hidden');
  progressBar.style.width = '0%';
  progressText.textContent = '0%';
}