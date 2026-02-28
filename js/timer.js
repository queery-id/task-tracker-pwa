// Task Tracker PWA - Timer Module
// 30-minute countdown with wake-up call overlay

const Timer = {
  DURATION: 30 * 60 * 1000, // 30 minutes in milliseconds
  UPDATE_INTERVAL: 1000, // Update every second
  STORAGE_KEY: 'tt_timer_end',

  timerEnd: null,
  intervalId: null,

  init() {
    // Load saved timer end time
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.timerEnd = parseInt(saved);
      if (this.timerEnd > Date.now()) {
        this.start();
      } else {
        this.clear();
      }
    } else {
      this.reset();
    }
  },

  start() {
    this.stop();
    this.intervalId = setInterval(() => this.tick(), this.UPDATE_INTERVAL);
    this.updateDisplay();
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  reset() {
    this.stop();
    this.timerEnd = Date.now() + this.DURATION;
    localStorage.setItem(this.STORAGE_KEY, this.timerEnd.toString());
    this.start();
  },

  clear() {
    this.stop();
    this.timerEnd = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateDisplay();
  },

  tick() {
    const now = Date.now();

    if (now >= this.timerEnd) {
      this.triggerWakeUpCall();
      this.reset();
    } else {
      this.updateDisplay();
    }
  },

  getRemainingTime() {
    if (!this.timerEnd) return this.DURATION;
    return Math.max(0, this.timerEnd - Date.now());
  },

  getFormattedTime() {
    const remaining = this.getRemainingTime();
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },

  getProgressPercent() {
    const remaining = this.getRemainingTime();
    return ((this.DURATION - remaining) / this.DURATION) * 100;
  },

  updateDisplay() {
    const timerDisplay = document.querySelector('.timer-display');
    const timerStrip = document.querySelector('.timer-strip');

    if (timerDisplay) {
      timerDisplay.textContent = this.getFormattedTime();

      // Warning state: < 5 minutes remaining
      const remaining = this.getRemainingTime();
      const fiveMinutes = 5 * 60 * 1000;

      if (remaining <= fiveMinutes) {
        timerDisplay.classList.add('text-warning');
        timerDisplay.classList.remove('timer-display');
      } else {
        timerDisplay.classList.remove('text-warning');
        timerDisplay.classList.add('timer-display');
      }
    }

    if (timerStrip) {
      timerStrip.style.width = `${100 - this.getProgressPercent()}%`;

      // Warning color for timer strip
      const remaining = this.getRemainingTime();
      const fiveMinutes = 5 * 60 * 1000;
      if (remaining <= fiveMinutes) {
        timerStrip.style.backgroundColor = 'var(--color-warning)';
      } else {
        timerStrip.style.backgroundColor = 'var(--color-accent)';
      }
    }
  },

  triggerWakeUpCall() {
    // Play sound
    this.playAlertSound();

    // Show overlay
    this.showWakeUpOverlay();

    // Show notification if permission granted
    this.showNotification();
  },

  playAlertSound() {
    const audio = new Audio('/assets/sounds/alert.mp3');
    audio.play().catch(() => {
      // Audio play failed (browser policy, file not found, etc.)
      console.log('Audio alert skipped');
    });
  },

  showWakeUpOverlay() {
    // This will be implemented with UI components
    const event = new CustomEvent('wakeup:trigger');
    document.dispatchEvent(event);
  },

  showNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Cek Fokus', {
        body: 'Sudah 30 menit! Apa yang sedang kamu kerjakan?',
        icon: '/assets/icons/icon-192.png',
        tag: 'wakeup-call'
      });
    }
  },

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
};

// Initialize timer on pages that use it
if (document.querySelector('.timer-display') || document.querySelector('.timer-strip')) {
  Timer.init();
}

export default Timer;
