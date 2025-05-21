// DOM elements
const authButtons = document.getElementById('auth-buttons');
const userProfile = document.getElementById('user-profile');
const usernameElement = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const closeLogin = document.getElementById('close-login');
const closeSignup = document.getElementById('close-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// API URL
const API_URL = 'http://localhost:3000/api';

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', checkAuth);

// Show/hide modal functions
function showModal(modal) {
  modal.classList.add('active');
}

function hideModal(modal) {
  modal.classList.remove('active');
}

// Event listeners for buttons
loginBtn.addEventListener('click', () => showModal(loginModal));
signupBtn.addEventListener('click', () => showModal(signupModal));
closeLogin.addEventListener('click', () => hideModal(loginModal));
closeSignup.addEventListener('click', () => hideModal(signupModal));
logoutBtn.addEventListener('click', logout);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === loginModal) hideModal(loginModal);
  if (e.target === signupModal) hideModal(signupModal);
});

// Form submissions
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Update UI
      hideModal(loginModal);
      loginForm.reset();
      showAlert('Logged in successfully', 'success');
      checkAuth();
    } else {
      showAlert(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    showAlert('An error occurred', 'error');
    console.error(error);
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Update UI
      hideModal(signupModal);
      signupForm.reset();
      showAlert('Account created successfully', 'success');
      checkAuth();
    } else {
      showAlert(data.error || 'Registration failed', 'error');
    }
  } catch (error) {
    showAlert('An error occurred', 'error');
    console.error(error);
  }
});

// Check if user is authenticated
async function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // No token, show auth buttons
    authButtons.classList.remove('hidden');
    userProfile.classList.add('hidden');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // User is authenticated, show profile
      authButtons.classList.add('hidden');
      userProfile.classList.remove('hidden');
      usernameElement.textContent = data.data.username;
      
      // Dispatch event to notify other components about auth state
      window.dispatchEvent(new CustomEvent('auth:login', {
        detail: { user: data.data }
      }));
    } else {
      // Invalid token, show auth buttons
      localStorage.removeItem('token');
      authButtons.classList.remove('hidden');
      userProfile.classList.add('hidden');
    }
  } catch (error) {
    console.error(error);
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  authButtons.classList.remove('hidden');
  userProfile.classList.add('hidden');
  
  // Dispatch event to notify other components
  window.dispatchEvent(new CustomEvent('auth:logout'));
  
  showAlert('Logged out successfully', 'success');
}

// Alert function
function showAlert(message, type) {
  // Create alert element
  const alertEl = document.createElement('div');
  alertEl.className = `alert alert-${type}`;
  alertEl.textContent = message;
  
  // Create a container for alerts if it doesn't exist
  let alertContainer = document.querySelector('.alert-container');
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.className = 'alert-container';
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '1000';
    document.body.appendChild(alertContainer);
  }
  
  // Style the alert
  alertEl.style.backgroundColor = type === 'success' ? '#10B981' : '#EF4444';
  alertEl.style.color = 'white';
  alertEl.style.padding = '0.75rem 1rem';
  alertEl.style.borderRadius = '8px';
  alertEl.style.marginBottom = '0.5rem';
  alertEl.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  alertEl.style.animation = 'slideIn 0.3s forwards';
  
  // Add alert to container
  alertContainer.appendChild(alertEl);
  
  // Remove after 3 seconds
  setTimeout(() => {
    alertEl.style.animation = 'slideOut 0.3s forwards';
    setTimeout(() => {
      alertContainer.removeChild(alertEl);
      // Remove container if empty
      if (alertContainer.children.length === 0) {
        document.body.removeChild(alertContainer);
      }
    }, 300);
  }, 3000);
}

// Define animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Expose auth functions globally
window.auth = {
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
  showAlert
};