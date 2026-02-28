// Task Tracker PWA - Authentication Module
// Handles PIN authentication using Web Crypto API (SHA-256)

const Auth = {
  PIN_STORAGE_KEY: 'tt_pin_hash',
  SESSION_KEY: 'tt_session',
  DEFAULT_PIN: '123456', // Default PIN for first-time login

  async hashPin(pin) {
    // Convert PIN to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);

    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  },

  hasPin() {
    return localStorage.getItem(this.PIN_STORAGE_KEY) !== null;
  },

  // Initialize with default PIN on first visit
  async initDefaultPin() {
    if (!this.hasPin()) {
      await this.setupPin(this.DEFAULT_PIN);
      console.log('Default PIN initialized:', this.DEFAULT_PIN);
    }
  },

  async setupPin(pin) {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      throw new Error('PIN harus 6 digit angka');
    }
    const hash = await this.hashPin(pin);
    localStorage.setItem(this.PIN_STORAGE_KEY, hash);
  },

  async verifyPin(pin) {
    const storedHash = localStorage.getItem(this.PIN_STORAGE_KEY);
    if (!storedHash) {
      throw new Error('PIN belum disetup');
    }
    const inputHash = await this.hashPin(pin);
    return storedHash === inputHash;
  },

  setSession(stayLoggedIn = false) {
    if (stayLoggedIn) {
      localStorage.setItem(this.SESSION_KEY, 'active');
    } else {
      sessionStorage.setItem(this.SESSION_KEY, 'active');
    }
  },

  hasSession() {
    return localStorage.getItem(this.SESSION_KEY) === 'active' ||
           sessionStorage.getItem(this.SESSION_KEY) === 'active';
  },

  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  // Request notification permission (for wake-up alerts)
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      } catch (err) {
        console.log('Notification permission request failed:', err);
      }
    }
  }
};

// Login form handler
const loginForm = document.getElementById('loginForm');
const pinInput = document.getElementById('pinInput');
const pinError = document.getElementById('pinError');
const setupMode = document.getElementById('setupMode');
const stayLoggedInCheckbox = document.getElementById('stayLoggedIn');

if (loginForm) {
  // Initialize default PIN on first visit
  (async () => {
    if (!Auth.hasPin()) {
      await Auth.initDefaultPin();
      // Show hint for first-time user
      setupMode.style.display = 'block';
      setupMode.querySelector('.setup-text').textContent = 'Default PIN: 123456';
    }
  })();

  // Auto-focus PIN input
  pinInput.focus();

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const pin = pinInput.value.trim();
    pinError.classList.add('hidden');

    // Validate PIN format
    if (!/^\d{6}$/.test(pin)) {
      showError('PIN harus 6 digit angka');
      return;
    }

    try {
      // Verify PIN (default or custom)
      const isValid = await Auth.verifyPin(pin);
      if (isValid) {
        Auth.setSession(stayLoggedInCheckbox.checked);

        // Request notification permission after successful login
        await Auth.requestNotificationPermission();

        window.location.href = '/dashboard.html';
      } else {
        showError('PIN salah. Coba lagi.');
      }
    } catch (error) {
      showError(error.message);
    }
  });

  function showError(message) {
    pinError.textContent = message;
    pinError.style.display = 'block';
    pinInput.classList.add('shake');
    setTimeout(() => pinInput.classList.remove('shake'), 300);
    pinInput.value = '';
    pinInput.focus();
  }
}

export default Auth;
