// Task Tracker PWA - App Router / Controller
// Handles navigation between pages

const App = {
  init() {
    console.log('Task Tracker App initialized');
    this.checkAuth();
    this.setupNavigation();
  },

  checkAuth() {
    // Check if user is logged in
    const session = localStorage.getItem('tt_session');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (!session && currentPage !== 'index.html') {
      window.location.href = '/index.html';
    }
  },

  setupNavigation() {
    // Handle back buttons, links, etc.
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-nav]')) {
        e.preventDefault();
        const target = e.target.getAttribute('data-nav');
        window.location.href = target;
      }
    });
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

export default App;
