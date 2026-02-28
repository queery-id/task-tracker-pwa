// Task Tracker PWA - Wake-Up Call Overlay
// Fullscreen overlay when 30-min timer expires

const WakeUp = {
  store: null,
  overlay: null,
  isOverlayOpen: false,

  init(store) {
    this.store = store;

    // Listen for wake-up trigger from timer
    document.addEventListener('wakeup:trigger', () => {
      this.showWakeUpOverlay();
    });

    // Listen for notification click (from service worker via postMessage)
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'WAKE_UP_NOTIFICATION_CLICK') {
        this.showWakeUpOverlay();
      }
    });

    // Create overlay element if not exists
    this.ensureOverlayExists();
  },

  ensureOverlayExists() {
    if (!document.getElementById('wakeUpOverlay')) {
      const overlay = this.createOverlay();
      document.body.appendChild(overlay);
    }
    this.overlay = document.getElementById('wakeUpOverlay');
  },

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'wakeUpOverlay';
    overlay.className = 'overlay wake-up-overlay hidden';
    overlay.setAttribute('aria-hidden', 'true');

    overlay.innerHTML = `
      <div class="overlay-card wake-up-card">
        <div class="wake-up-header">
          <h2>🎯 Cek Fokus</h2>
          <p class="wake-up-subtitle">Sudah 30 menit berlalu</p>
        </div>

        <form id="wakeUpForm" class="wake-up-form">
          <p class="wake-up-question">Sedang mengerjakan apa?</p>

          <div id="wakeUpTasks" class="wake-up-tasks">
            <!-- Tasks will be rendered here -->
          </div>

          <label class="wake-up-option distracted-option">
            <input type="radio" name="wakeUpSelection" value="distracted">
            <span>😕 Saya terdistraksi</span>
          </label>

          <div id="wakeUpMessage" class="wake-up-message hidden"></div>

          <button type="submit" id="wakeUpSubmitBtn" class="btn btn-primary btn-block" disabled>
            Lanjut Kerja
          </button>
        </form>
      </div>
    `;

    return overlay;
  },

  showWakeUpOverlay() {
    this.ensureOverlayExists();

    if (this.isOverlayOpen) return;

    // Play audio alert
    this.playAlert();

    // Render tasks in overlay
    this.renderWakeUpTasks();

    // Show overlay
    this.overlay.classList.remove('hidden');
    this.overlay.setAttribute('aria-hidden', 'false');
    this.isOverlayOpen = true;

    // Setup form handler
    this.setupFormHandler();

    // Prevent ESC key from closing
    this.preventEscape();

    // Prevent clicking outside to close
    this.preventOutsideClick();
  },

  hideWakeUpOverlay() {
    if (!this.isOverlayOpen) return;

    this.overlay.classList.add('hidden');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.isOverlayOpen = false;

    // Reset form
    const form = document.getElementById('wakeUpForm');
    if (form) form.reset();

    // Reset submit button
    const submitBtn = document.getElementById('wakeUpSubmitBtn');
    if (submitBtn) submitBtn.disabled = true;

    // Hide message
    const message = document.getElementById('wakeUpMessage');
    if (message) {
      message.classList.add('hidden');
      message.innerHTML = '';
    }
  },

  renderWakeUpTasks() {
    const tasksContainer = document.getElementById('wakeUpTasks');
    if (!tasksContainer || !this.store) return;

    const tasks = this.store.getAllTasks();

    if (tasks.length === 0) {
      tasksContainer.innerHTML = '<p class="text-muted text-center">Belum ada task aktif.</p>';
      return;
    }

    tasksContainer.innerHTML = '';

    tasks.forEach(task => {
      const completedSubtasks = task.subtasks.filter(st => st.done).length;
      const totalSubtasks = task.subtasks.length;
      const progress = totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks}` : '0/0';

      const label = document.createElement('label');
      label.className = 'wake-up-option task-option';
      label.innerHTML = `
        <input type="radio" name="wakeUpSelection" value="${task.id}" data-task-title="${task.title}">
        <div class="task-option-content">
          <span class="task-option-title">${this.escapeHtml(task.title)}</span>
          <span class="task-option-progress">${progress} selesai</span>
        </div>
      `;
      tasksContainer.appendChild(label);
    });
  },

  setupFormHandler() {
    const form = document.getElementById('wakeUpForm');
    const submitBtn = document.getElementById('wakeUpSubmitBtn');
    const messageDiv = document.getElementById('wakeUpMessage');

    if (!form) return;

    // Enable/disable submit button based on selection
    form.addEventListener('change', () => {
      const selected = form.querySelector('input[name="wakeUpSelection"]:checked');
      submitBtn.disabled = !selected;

      // Show motivation message if "distracted" selected
      if (selected && selected.value === 'distracted') {
        this.showMotivationMessage();
      } else {
        messageDiv.classList.add('hidden');
      }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleWakeUpResponse();
    });
  },

  showMotivationMessage() {
    const messageDiv = document.getElementById('wakeUpMessage');
    if (!messageDiv) return;

    const messages = [
      "Tetap fokus! Targetmu dekat kok. 🎯",
      "Jangan menyerah! Kamu pasti bisa. 💪",
      "Istirahat sejenak, lalu lanjut lagi! ☕",
      "Setiap langkah kecil mendekatkanmu ke tujuan. 🚀",
      "Fokus kembali, kamu bisa melakukannya! 🔥"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageDiv.innerHTML = `<p>${randomMessage}</p>`;
    messageDiv.classList.remove('hidden');
  },

  handleWakeUpResponse() {
    const form = document.getElementById('wakeUpForm');
    const selected = form ? form.querySelector('input[name="wakeUpSelection"]:checked') : null;

    if (!selected) return;

    const selectedValue = selected.value;
    const wasDistracted = selectedValue === 'distracted';

    // Log to store
    if (this.store) {
      this.store.logWakeUp(selectedValue, wasDistracted);
    }

    // Hide overlay
    this.hideWakeUpOverlay();

    // Reset timer
    if (window.Timer) {
      Timer.reset();
    }

    console.log('Wake-up response logged:', { selected: selectedValue, wasDistracted });
  },

  playAlert() {
    // Play audio notification
    const audio = new Audio('/assets/sounds/alert.mp3');
    audio.play().catch(() => {
      // Audio play failed (browser policy, etc.)
      console.log('Audio alert skipped');
    });
  },

  preventEscape() {
    const handler = (e) => {
      if (e.key === 'Escape' && this.isOverlayOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('keydown', handler);
    // Store handler for cleanup (not implemented for simplicity)
    this.escapeHandler = handler;
  },

  preventOutsideClick() {
    // Prevent click outside from closing overlay
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay && this.isOverlayOpen) {
          e.stopPropagation();
          e.preventDefault();
        }
      });
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

export default WakeUp;
