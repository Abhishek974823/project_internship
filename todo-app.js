class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    this.currentFilter = 'all';
    this.initializeElements();
    this.bindEvents();
    this.render();
  }

  initializeElements() {
    this.taskInput = document.getElementById('taskInput');
    this.addBtn = document.getElementById('addBtn');
    this.taskList = document.getElementById('taskList');
    this.emptyState = document.getElementById('emptyState');
    this.totalTasks = document.getElementById('totalTasks');
    this.completedTasks = document.getElementById('completedTasks');
    this.pendingTasks = document.getElementById('pendingTasks');
    this.filterButtons = document.querySelectorAll('.filter-btn');
  }

  bindEvents() {
    this.addBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });

    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
    });
  }

  addTask() {
    const text = this.taskInput.value.trim();
    if (!text) return;

    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.unshift(task);
    this.taskInput.value = '';
    this.saveToStorage();
    this.render();
    
    // Add a nice feedback animation
    this.taskInput.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.taskInput.style.transform = 'scale(1)';
    }, 150);
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToStorage();
      this.render();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToStorage();
    this.render();
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.render();
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'pending':
        return this.tasks.filter(task => !task.completed);
      default:
        return this.tasks;
    }
  }

  updateStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    this.totalTasks.textContent = total;
    this.completedTasks.textContent = completed;
    this.pendingTasks.textContent = pending;

    // Add animation to stats
    [this.totalTasks, this.completedTasks, this.pendingTasks].forEach(el => {
      el.style.transform = 'scale(1.1)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 200);
    });
  }

  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask(${task.id})"></div>
      <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
      <div class="task-actions">
        <button class="action-btn delete-btn" onclick="todoApp.deleteTask(${task.id})" title="Delete task">
          🗑️
        </button>
      </div>
    `;
    return li;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  render() {
    const filteredTasks = this.getFilteredTasks();
    
    this.taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
      this.emptyState.classList.remove('hidden');
      if (this.currentFilter !== 'all') {
        this.emptyState.innerHTML = `
          <div class="empty-icon">🔍</div>
          <h3>No ${this.currentFilter} tasks</h3>
          <p>Try switching to a different filter or add some tasks!</p>
        `;
      } else {
        this.emptyState.innerHTML = `
          <div class="empty-icon">📝</div>
          <h3>No tasks yet</h3>
          <p>Add your first task above to get started!</p>
        `;
      }
    } else {
      this.emptyState.classList.add('hidden');
      filteredTasks.forEach(task => {
        this.taskList.appendChild(this.createTaskElement(task));
      });
    }

    this.updateStats();
  }

  saveToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.todoApp = new TodoApp();
});

// Add some nice console styling for developers
console.log(
  '%c🚀 Daily Task Wizard Loaded! ',
  'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border-radius: 10px; font-size: 16px; font-weight: bold;'
);
