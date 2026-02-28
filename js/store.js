// Task Tracker PWA - Data Layer
// CRUD operations for tasks and sub-tasks using localStorage

const Store = {
  STORAGE_KEY: 'tt_data',
  SEEDED_KEY: 'tt_seeded', // Track if seed data has been loaded

  // Get all data from localStorage
  getData() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return this.getInitialData();
    }
    try {
      return JSON.parse(raw);
    } catch {
      return this.getInitialData();
    }
  },

  // Save data to localStorage
  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  // Get initial empty data structure
  getInitialData() {
    return {
      tasks: [],
      wakeUpLog: []
    };
  },

  // Seed initial data for testing
  seedData() {
    // Check if already seeded
    if (localStorage.getItem(this.SEEDED_KEY) === 'true') {
      return;
    }

    const now = Date.now();
    const seedTasks = [
      {
        id: `t_${now}`,
        title: 'Deploy Maktabah v2',
        priority: 'high',
        created_at: new Date().toISOString(),
        subtasks: [
          { id: `s_${now + 1}`, label: 'Setup production server', done: true },
          { id: `s_${now + 2}`, label: 'Run database migrations', done: true },
          { id: `s_${now + 3}`, label: 'Fix mobile responsive issues', done: false },
          { id: `s_${now + 4}`, label: 'Test all features', done: false },
          { id: `s_${now + 5}`, label: 'Deploy to production', done: false }
        ]
      },
      {
        id: `t_${now + 1000}`,
        title: 'Fix responsive CSS',
        priority: 'medium',
        created_at: new Date().toISOString(),
        subtasks: [
          { id: `s_${now + 100}`, label: 'Fix navbar on mobile', done: true },
          { id: `s_${now + 200}`, label: 'Adjust card padding', done: false },
          { id: `s_${now + 300}`, label: 'Test on tablet', done: false }
        ]
      }
    ];

    const data = this.getData();
    data.tasks = seedTasks;
    this.saveData(data);
    localStorage.setItem(this.SEEDED_KEY, 'true');
    console.log('Seed data loaded:', seedTasks.length, 'tasks');
  },

  // Clear seed data flag (for testing)
  clearSeedFlag() {
    localStorage.removeItem(this.SEEDED_KEY);
  },

  // ===== Task CRUD =====

  // Alias for getAllTasks() (easier to use)
  getTasks() {
    return this.getAllTasks();
  },

  getAllTasks() {
    return this.getData().tasks;
  },

  getTask(taskId) {
    const tasks = this.getAllTasks();
    return tasks.find(t => t.id === taskId);
  },

  createTask(title, priority = 'medium') {
    const data = this.getData();
    const task = {
      id: `t_${Date.now()}`,
      title,
      priority,
      created_at: new Date().toISOString(),
      subtasks: []
    };
    data.tasks.push(task);
    this.saveData(data);
    return task;
  },

  updateTask(taskId, updates) {
    const data = this.getData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
    this.saveData(data);
    return data.tasks[taskIndex];
  },

  deleteTask(taskId) {
    const data = this.getData();
    data.tasks = data.tasks.filter(t => t.id !== taskId);
    this.saveData(data);
  },

  // Mark all subtasks as complete
  markTaskComplete(taskId) {
    const task = this.getTask(taskId);
    if (!task) return false;

    task.subtasks.forEach(st => {
      st.done = true;
    });

    this.updateTask(taskId, { subtasks: task.subtasks });
    return true;
  },

  // ===== Sub-task CRUD =====

  addSubtask(taskId, label) {
    const task = this.getTask(taskId);
    if (!task) return null;

    const subtask = {
      id: `s_${Date.now()}`,
      label,
      done: false
    };

    task.subtasks.push(subtask);
    this.updateTask(taskId, { subtasks: task.subtasks });
    return subtask;
  },

  toggleSubtask(taskId, subtaskId) {
    const task = this.getTask(taskId);
    if (!task) return false;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (subtask) {
      subtask.done = !subtask.done;
      this.updateTask(taskId, { subtasks: task.subtasks });
      return subtask.done;
    }
    return false;
  },

  deleteSubtask(taskId, subtaskId) {
    const task = this.getTask(taskId);
    if (!task) return false;

    task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
    this.updateTask(taskId, { subtasks: task.subtasks });
    return true;
  },

  updateSubtaskLabel(taskId, subtaskId, newLabel) {
    const task = this.getTask(taskId);
    if (!task) return false;

    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (subtask) {
      subtask.label = newLabel;
      this.updateTask(taskId, { subtasks: task.subtasks });
      return true;
    }
    return false;
  },

  // ===== Wake-up Log =====

  logWakeUp(selectedTask, wasDistracted) {
    const data = this.getData();
    data.wakeUpLog.push({
      timestamp: new Date().toISOString(),
      selected_task: selectedTask,
      was_distracted: wasDistracted
    });
    this.saveData(data);
  },

  // ===== Export/Import (Bonus) =====

  exportData() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Format data tidak valid');
      }
      this.saveData(data);
      return true;
    } catch {
      return false;
    }
  }
};

export default Store;
