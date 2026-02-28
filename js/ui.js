// Task Tracker PWA - UI Helpers
// DOM manipulation utilities and common UI patterns

const UI = {
  // Store reference for data access
  store: null,

  init(store) {
    this.store = store;
  },

  // Show an element
  show(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.remove('hidden');
    }
  },

  // Hide an element
  hide(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.add('hidden');
    }
  },

  // Toggle element visibility
  toggle(element, force) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.toggle('hidden', force);
    }
  },

  // Create element with attributes and content
  createElement(tag, options = {}) {
    const el = document.createElement(tag);

    if (options.class) {
      el.className = options.class;
    }

    if (options.id) {
      el.id = options.id;
    }

    if (options.text) {
      el.textContent = options.text;
    }

    if (options.html) {
      el.innerHTML = options.html;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        el.setAttribute(key, value);
      });
    }

    if (options.events) {
      Object.entries(options.events).forEach(([event, handler]) => {
        el.addEventListener(event, handler);
      });
    }

    if (options.children) {
      options.children.forEach(child => el.appendChild(child));
    }

    return el;
  },

  // Render task card (complete HTML)
  renderTaskCard(task) {
    const completedSubtasks = task.subtasks.filter(st => st.done).length;
    const totalSubtasks = task.subtasks.length;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const borderClass = this.getPriorityBorderClass(task.priority);

    // Card container
    const card = this.createElement('div', {
      class: `card task-card ${borderClass}`,
      attributes: { 'data-task-id': task.id }
    });

    // Card header (title + delete button)
    const header = this.createElement('div', { class: 'task-card-header' });

    const titleEditable = this.createElement('input', {
      class: 'task-title-editable',
      attributes: {
        value: task.title,
        'data-task-id': task.id
      },
      events: {
        blur: (e) => this.handleTitleChange(task.id, e.target.value),
        keydown: (e) => {
          if (e.key === 'Enter') {
            e.target.blur();
          }
        }
      }
    }
    );
    header.appendChild(titleEditable);

    // Delete button
    const deleteBtn = this.createElement('button', {
      class: 'btn btn-ghost btn-icon',
      attributes: { 'aria-label': 'Hapus task', 'data-task-id': task.id },
      html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>`,
      events: {
        click: () => this.handleDeleteTask(task.id)
      }
    });
    header.appendChild(deleteBtn);

    card.appendChild(header);

    // Progress section
    const progressSection = this.createElement('div', { class: 'task-meta' });

    const progressBadge = this.createElement('span', {
      class: 'badge',
      text: `${completedSubtasks}/${totalSubtasks} selesai`
    });
    progressSection.appendChild(progressBadge);

    card.appendChild(progressSection);

    // Progress bar
    const progressContainer = this.createElement('div', { class: 'progress' });
    const progressBar = this.createElement('div', {
      class: 'progress-bar',
      attributes: { style: `width: ${progress}%` }
    });
    progressContainer.appendChild(progressBar);
    card.appendChild(progressContainer);

    // Subtasks preview (max 3)
    if (task.subtasks.length > 0) {
      const previewContainer = this.createElement('div', { class: 'task-subtasks-preview' });

      const previewList = this.createElement('div', { class: 'subtask-preview-list' });

      const previewSubtasks = task.subtasks.slice(0, 3);
      previewSubtasks.forEach(subtask => {
        const previewItem = this.createElement('div', {
          class: `subtask-preview-item ${subtask.done ? 'completed' : ''}`
        });

        const checkbox = this.createElement('input', {
          class: 'subtask-preview-checkbox',
          attributes: {
            type: 'checkbox',
            checked: subtask.done,
            'data-task-id': task.id,
            'data-subtask-id': subtask.id
          },
          events: {
            change: () => this.handleToggleSubtask(task.id, subtask.id)
          }
        });
        previewItem.appendChild(checkbox);

        const label = this.createElement('span', {
          class: 'subtask-preview-label',
          text: subtask.label
        });
        previewItem.appendChild(label);

        previewList.appendChild(previewItem);
      });

      previewContainer.appendChild(previewList);
      card.appendChild(previewContainer);

      // "Lihat Semua" link if more than 3 subtasks
      if (task.subtasks.length > 3) {
        const viewAllLink = this.createElement('a', {
          class: 'view-all-btn',
          text: `Lihat semua (${task.subtasks.length} sub-tugas)`,
          attributes: { href: `/detail.html?task=${task.id}` }
        });
        card.appendChild(viewAllLink);
      } else if (task.subtasks.length > 0) {
        const viewAllLink = this.createElement('a', {
          class: 'view-all-btn',
          text: 'Lihat semua',
          attributes: { href: `/detail.html?task=${task.id}` }
        });
        card.appendChild(viewAllLink);
      }
    }

    return card;
  },

  // Render all task cards
  renderTaskCards() {
    const taskGrid = document.getElementById('taskGrid');
    const emptyState = document.getElementById('emptyState');
    const addTaskBtn = document.getElementById('addTaskBtn');

    if (!taskGrid) return;

    const tasks = this.store ? this.store.getAllTasks() : [];

    // Clear existing cards
    taskGrid.innerHTML = '';

    // Show/hide empty state
    if (tasks.length === 0) {
      this.show(emptyState);
      this.show(addTaskBtn);
    } else {
      this.hide(emptyState);

      // Render each task card
      tasks.forEach(task => {
        const card = this.renderTaskCard(task);
        taskGrid.appendChild(card);
      });

      // Hide FAB if max 3 tasks reached
      if (tasks.length >= 3) {
        this.hide(addTaskBtn);
      } else {
        this.show(addTaskBtn);
      }
    }
  },

  // Handle title change
  handleTitleChange(taskId, newTitle) {
    if (this.store && newTitle.trim()) {
      this.store.updateTask(taskId, { title: newTitle.trim() });
    }
  },

  // Handle delete task
  handleDeleteTask(taskId) {
    if (confirm('Hapus task ini?')) {
      if (this.store) {
        this.store.deleteTask(taskId);
        this.renderTaskCards();
      }
    }
  },

  // Handle toggle subtask
  handleToggleSubtask(taskId, subtaskId) {
    if (this.store) {
      this.store.toggleSubtask(taskId, subtaskId);
      this.renderTaskCards(); // Re-render to update progress
    }
  },

  // ===== Detail Page Methods =====

  // Render detail page for a single task
  renderDetailPage(taskId) {
    const task = this.store ? this.store.getTask(taskId) : null;
    if (!task) {
      console.error('Task not found:', taskId);
      return;
    }

    // Update page title
    const taskTitle = document.getElementById('taskTitle');
    if (taskTitle) {
      taskTitle.textContent = task.title;
      // Make editable
      taskTitle.contentEditable = true;
      taskTitle.addEventListener('blur', () => {
        this.store.updateTask(taskId, { title: taskTitle.textContent.trim() });
      });
      taskTitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          taskTitle.blur();
        }
      });
    }

    // Update progress
    this.updateDetailProgress(task);

    // Render subtask list
    this.renderSubtaskList(taskId);
  },

  // Update progress bar and badge on detail page
  updateDetailProgress(task) {
    const completedSubtasks = task.subtasks.filter(st => st.done).length;
    const totalSubtasks = task.subtasks.length;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    // Update progress text badge
    const progressText = document.getElementById('progressText');
    if (progressText) {
      progressText.textContent = `${completedSubtasks}/${totalSubtasks} selesai`;
    }

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  },

  // Render full subtask list on detail page
  renderSubtaskList(taskId) {
    const task = this.store ? this.store.getTask(taskId) : null;
    if (!task) return;

    const subtaskList = document.getElementById('subtaskList');
    if (!subtaskList) return;

    subtaskList.innerHTML = '';

    // Separate pending and completed subtasks
    const pendingSubtasks = task.subtasks.filter(st => !st.done);
    const completedSubtasks = task.subtasks.filter(st => st.done);

    // Render pending subtasks
    pendingSubtasks.forEach(subtask => {
      subtaskList.appendChild(this.createSubtaskItem(taskId, subtask));
    });

    // Render completed subtasks (collapsible)
    if (completedSubtasks.length > 0) {
      const separator = this.createElement('li', {
        class: 'subtask-separator',
        attributes: { role: 'presentation' }
      });
      subtaskList.appendChild(separator);

      const collapsibleHeader = this.createElement('li', {
        class: 'subtask-collapsible-header'
      });

      const toggleBtn = this.createElement('button', {
        class: 'btn btn-ghost btn-sm',
        text: `▼ Selesai (${completedSubtasks.length})`,
        events: {
          click: () => this.toggleCompletedSection()
        }
      });
      collapsibleHeader.appendChild(toggleBtn);
      subtaskList.appendChild(collapsibleHeader);

      const completedList = this.createElement('li', {
        class: 'subtask-completed-list',
        attributes: { id: 'completedSubtasks' }
      });

      completedSubtasks.forEach(subtask => {
        completedList.appendChild(this.createSubtaskItem(taskId, subtask));
      });

      subtaskList.appendChild(completedList);
    }
  },

  // Create single subtask item
  createSubtaskItem(taskId, subtask) {
    const item = this.createElement('li', {
      class: `subtask-item ${subtask.done ? 'completed' : ''}`
    });

    // Checkbox
    const checkbox = this.createElement('input', {
      class: 'subtask-checkbox',
      attributes: {
        type: 'checkbox',
        checked: subtask.done,
        'data-subtask-id': subtask.id
      },
      events: {
        change: () => {
          this.store.toggleSubtask(taskId, subtask.id);
          this.renderDetailPage(taskId);
        }
      }
    });
    item.appendChild(checkbox);

    // Editable label
    const label = this.createElement('input', {
      class: 'subtask-label',
      attributes: {
        value: subtask.label,
        'data-subtask-id': subtask.id
      },
      events: {
        blur: (e) => {
          this.store.updateSubtaskLabel(taskId, subtask.id, e.target.value.trim());
        },
        keydown: (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
          }
        }
      }
    });
    item.appendChild(label);

    // Delete button
    const deleteBtn = this.createElement('button', {
      class: 'subtask-delete',
      attributes: { 'aria-label': 'Hapus sub-tugas' },
      html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>`,
      events: {
        click: () => {
          if (confirm('Hapus sub-tugas ini?')) {
            this.store.deleteSubtask(taskId, subtask.id);
            this.renderDetailPage(taskId);
          }
        }
      }
    });
    item.appendChild(deleteBtn);

    return item;
  },

  // Toggle completed subtasks section
  toggleCompletedSection() {
    const completedList = document.getElementById('completedSubtasks');
    if (completedList) {
      completedList.classList.toggle('hidden');
    }
  },

  // Add new subtask
  handleAddSubtask(taskId, label) {
    if (!label.trim()) return;

    this.store.addSubtask(taskId, label.trim());
    this.renderDetailPage(taskId);
  },

  // Mark task complete
  handleMarkComplete(taskId) {
    if (confirm('Tandai semua sub-tugas sebagai selesai?')) {
      this.store.markTaskComplete(taskId);
      this.renderDetailPage(taskId);
    }
  },

  // Delete task
  handleDeleteTaskFromDetail(taskId) {
    if (confirm('Hapus task ini beserta semua sub-tugas?')) {
      this.store.deleteTask(taskId);
      window.location.href = '/dashboard.html';
    }
  },

  getPriorityBorderClass(priority) {
    switch (priority) {
      case 'high': return 'border-l-danger';
      case 'medium': return 'border-l-warning';
      default: return 'border-l-success';
    }
  },

  // Show toast message
  toast(message, type = 'info') {
    const toast = this.createElement('div', {
      class: `toast toast-${type}`,
      text: message
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  },

  // Confirm dialog
  confirm(message) {
    return window.confirm(message);
  },

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

export default UI;
