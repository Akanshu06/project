// Main JavaScript entry point

// Helper function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

// Helper function to format numbers
function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number.toString();
  }
}

// Initialize video playback behavior
document.addEventListener('click', function(e) {
  // Handle clicking on video thumbnails to play/pause
  if (e.target.tagName === 'VIDEO') {
    if (e.target.paused) {
      // Pause all other videos
      document.querySelectorAll('video').forEach(video => {
        if (video !== e.target) video.pause();
      });
      
      // Play the clicked video
      e.target.play();
    } else {
      e.target.pause();
    }
  }
});

// Check for media query changes
const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

function handleMediaQueryChange(e) {
  // Adjust UI for mobile/desktop
  if (e.matches) {
    // Mobile layout adjustments
    console.log('Mobile view active');
  } else {
    // Desktop layout adjustments
    console.log('Desktop view active');
  }
}

// Initial check
handleMediaQueryChange(mobileMediaQuery);

// Listen for changes
mobileMediaQuery.addEventListener('change', handleMediaQueryChange);

// Initialize app
console.log('VibeShare app initialized');