/**
 * ============================================================================
 * Girija_TodoApp - Modern To-Do List Application
 * Author: Girija (CodeOrbit Internship Submission)
 * Technology: Vanilla JavaScript (ES6+), HTML5, CSS3, localStorage
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Constants & Storage Keys
  // --------------------------------------------------------------------------
  const STORAGE_KEY_TASKS = 'girija_todo_tasks';
  const STORAGE_KEY_THEME = 'girija_todo_theme';

  // Default initial sample tasks for first-time visitors
  const INITIAL_TASKS = [
    {
      id: 'task-1',
      text: 'Plan daily priorities and project goals',
      completed: true,
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'task-2',
      text: 'Build modern responsive To-Do list with vanilla JavaScript',
      completed: true,
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'task-3',
      text: 'Push code to GitHub repository',
      completed: false,
      createdAt: Date.now(),
    },
  ];

  // --------------------------------------------------------------------------
  // 2. Application State
  // --------------------------------------------------------------------------
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'pending' | 'completed'
  let editingTaskId = null;
  let pendingDeleteAction = null; // Callback or object for modal confirmation

  // --------------------------------------------------------------------------
  // 3. DOM Element References
  // --------------------------------------------------------------------------
  const taskForm = document.getElementById('addTaskForm');
  const taskInput = document.getElementById('taskInput');
  const validationMsg = document.getElementById('validationMessage');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const emptyStateTitle = document.getElementById('emptyStateTitle');
  const emptyStateDesc = document.getElementById('emptyStateDesc');

  // Stats Elements
  const totalCountEl = document.getElementById('totalCount');
  const pendingCountEl = document.getElementById('pendingCount');
  const completedCountEl = document.getElementById('completedCount');
  const progressPercentEl = document.getElementById('progressPercent');
  const progressRatioEl = document.getElementById('progressRatio');
  const progressFillEl = document.getElementById('progressFill');

  // Filter & Toolbar Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterAllBadge = document.getElementById('filterAllBadge');
  const filterPendingBadge = document.getElementById('filterPendingBadge');
  const filterCompletedBadge = document.getElementById('filterCompletedBadge');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');

  // Modal Elements
  const confirmModal = document.getElementById('confirmModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTargetText = document.getElementById('modalTargetText');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // --------------------------------------------------------------------------
  // 4. Persistence (localStorage)
  // --------------------------------------------------------------------------
  function loadTasksFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TASKS);
      if (stored === null) {
        // First visit: use sample tasks to illustrate functionality
        tasks = [...INITIAL_TASKS];
        saveTasksToStorage();
      } else {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          tasks = parsed.filter(t => t && typeof t.id === 'string' && typeof t.text === 'string');
        } else {
          tasks = [];
        }
      }
    } catch (err) {
      console.error('Error loading tasks from localStorage:', err);
      tasks = [];
    }
  }

  function saveTasksToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
      showToast('Could not save to local storage (storage full or disabled)', 'danger');
    }
  }

  // --------------------------------------------------------------------------
  // 5. Theme Management (Light / Dark Mode)
  // --------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIconSun) themeIconSun.style.display = 'block';
      if (themeIconMoon) themeIconMoon.style.display = 'none';
      themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      themeToggleBtn.title = 'Switch to light theme';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIconSun) themeIconSun.style.display = 'none';
      if (themeIconMoon) themeIconMoon.style.display = 'block';
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      themeToggleBtn.title = 'Switch to dark theme';
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme} mode`, 'info');
  }

  // --------------------------------------------------------------------------
  // 6. Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.innerHTML = iconSvg;
    toast.appendChild(textSpan);

    toastContainer.appendChild(toast);

    // Trigger animation in next frame
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2800);
  }

  // --------------------------------------------------------------------------
  // 7. Validation Helpers
  // --------------------------------------------------------------------------
  function showValidationError(message) {
    if (!validationMsg || !taskInput) return;
    const errorTextSpan = validationMsg.querySelector('.error-text') || validationMsg;
    errorTextSpan.textContent = message;
    validationMsg.classList.add('visible');
    taskInput.classList.add('input-error');
    taskInput.focus();
  }

  function clearValidationError() {
    if (!validationMsg || !taskInput) return;
    validationMsg.classList.remove('visible');
    taskInput.classList.remove('input-error');
  }

  // --------------------------------------------------------------------------
  // 8. Task Actions: Add, Toggle, Edit, Delete
  // --------------------------------------------------------------------------
  function addTask(text) {
    const cleanText = text.trim();
    if (!cleanText) {
      showValidationError('Please enter a task description before adding.');
      return false;
    }

    clearValidationError();

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      text: cleanText,
      completed: false,
      createdAt: Date.now(),
    };

    tasks.unshift(newTask);
    saveTasksToStorage();
    render();
    showToast('Task added successfully!', 'success');
    return true;
  }

  function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasksToStorage();
    render();

    if (task.completed) {
      showToast('Task marked as completed!', 'success');
    } else {
      showToast('Task marked as pending.', 'info');
    }
  }

  function startEditingTask(taskId) {
    editingTaskId = taskId;
    render();
    const editInput = document.getElementById(`edit-input-${taskId}`);
    if (editInput) {
      editInput.focus();
      editInput.select();
    }
  }

  function cancelEditingTask() {
    editingTaskId = null;
    render();
  }

  function saveEditedTask(taskId, newText) {
    const cleanText = newText.trim();
    if (!cleanText) {
      showToast('Task title cannot be empty.', 'danger');
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.text = cleanText;
    editingTaskId = null;
    saveTasksToStorage();
    render();
    showToast('Task updated successfully!', 'success');
  }

  function promptDeleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    pendingDeleteAction = {
      type: 'single',
      taskId: taskId,
      title: task.text,
    };

    modalTitle.textContent = 'Delete Task';
    modalDesc.textContent = 'Are you sure you want to delete this task? This action cannot be undone.';
    modalTargetText.textContent = `"${task.text}"`;
    modalTargetText.style.display = 'block';
    modalConfirmBtn.textContent = 'Delete Task';

    openModal();
  }

  function promptClearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    pendingDeleteAction = {
      type: 'clear-completed',
    };

    modalTitle.textContent = 'Clear Completed Tasks';
    modalDesc.textContent = `Are you sure you want to delete all ${completedCount} completed task(s)?`;
    modalTargetText.style.display = 'none';
    modalConfirmBtn.textContent = 'Clear All';

    openModal();
  }

  function executePendingAction() {
    if (!pendingDeleteAction) return;

    if (pendingDeleteAction.type === 'single') {
      const taskId = pendingDeleteAction.taskId;
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasksToStorage();
      render();
      showToast('Task deleted successfully.', 'info');
    } else if (pendingDeleteAction.type === 'clear-completed') {
      const beforeCount = tasks.length;
      tasks = tasks.filter(t => !t.completed);
      const removedCount = beforeCount - tasks.length;
      saveTasksToStorage();
      render();
      showToast(`Cleared ${removedCount} completed task(s).`, 'info');
    }

    closeModal();
  }

  // --------------------------------------------------------------------------
  // 9. Modal Control
  // --------------------------------------------------------------------------
  function openModal() {
    if (!confirmModal) return;
    confirmModal.classList.add('active');
    modalConfirmBtn.focus();
    document.addEventListener('keydown', handleModalKeyDown);
  }

  function closeModal() {
    if (!confirmModal) return;
    confirmModal.classList.remove('active');
    pendingDeleteAction = null;
    document.removeEventListener('keydown', handleModalKeyDown);
  }

  function handleModalKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  // --------------------------------------------------------------------------
  // 10. Filter & Stats Calculation
  // --------------------------------------------------------------------------
  function getFilteredTasks() {
    if (currentFilter === 'pending') {
      return tasks.filter(t => !t.completed);
    }
    if (currentFilter === 'completed') {
      return tasks.filter(t => t.completed);
    }
    return tasks;
  }

  function updateSummaryAndStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // Update Counter Badges
    if (totalCountEl) totalCountEl.textContent = total;
    if (pendingCountEl) pendingCountEl.textContent = pending;
    if (completedCountEl) completedCountEl.textContent = completed;

    if (filterAllBadge) filterAllBadge.textContent = total;
    if (filterPendingBadge) filterPendingBadge.textContent = pending;
    if (filterCompletedBadge) filterCompletedBadge.textContent = completed;

    // Update Progress Bar
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    if (progressPercentEl) progressPercentEl.textContent = `${percent}%`;
    if (progressRatioEl) progressRatioEl.textContent = `${completed} of ${total} tasks`;
    if (progressFillEl) progressFillEl.style.width = `${percent}%`;

    // Clear completed button state
    if (clearCompletedBtn) {
      clearCompletedBtn.disabled = completed === 0;
    }
  }

  // --------------------------------------------------------------------------
  // 11. Render UI (Safe DOM Construction)
  // --------------------------------------------------------------------------
  function render() {
    updateSummaryAndStats();

    const filtered = getFilteredTasks();
    taskList.innerHTML = '';

    // Handle Empty State
    if (filtered.length === 0) {
      taskList.style.display = 'none';
      emptyState.style.display = 'flex';

      if (currentFilter === 'pending') {
        emptyStateTitle.textContent = 'All caught up!';
        emptyStateDesc.textContent = 'You have no pending tasks. Great job!';
      } else if (currentFilter === 'completed') {
        emptyStateTitle.textContent = 'No completed tasks';
        emptyStateDesc.textContent = 'Finish a task to see it marked as completed here.';
      } else {
        emptyStateTitle.textContent = 'No tasks yet';
        emptyStateDesc.textContent = 'Add your first task above to get organized and stay productive!';
      }
      return;
    }

    taskList.style.display = 'flex';
    emptyState.style.display = 'none';

    // Build Task Items safely with native DOM methods
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.id = `item-${task.id}`;

      // Check if this task is currently in edit mode
      if (editingTaskId === task.id) {
        li.appendChild(createEditForm(task));
      } else {
        li.appendChild(createTaskContent(task));
      }

      taskList.appendChild(li);
    });
  }

  /**
   * Creates the standard view of a task item
   */
  function createTaskContent(task) {
    const fragment = document.createDocumentFragment();

    // Main Content: Checkbox + Title
    const mainContent = document.createElement('div');
    mainContent.className = 'task-main-content';

    // Accessible Checkbox Label
    const checkboxContainer = document.createElement('label');
    checkboxContainer.className = 'checkbox-container';
    checkboxContainer.setAttribute('aria-label', `Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const customCheckbox = document.createElement('span');
    customCheckbox.className = 'custom-checkbox';
    customCheckbox.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(customCheckbox);

    // Title Span (using textContent for 100% XSS safety)
    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = task.text;

    mainContent.appendChild(checkboxContainer);
    mainContent.appendChild(titleSpan);

    // Action Buttons: Edit & Delete
    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'task-actions';

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'action-btn edit-btn';
    editBtn.title = 'Edit task';
    editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);
    editBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
    editBtn.addEventListener('click', () => startEditingTask(task.id));

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.title = 'Delete task';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
    deleteBtn.addEventListener('click', () => promptDeleteTask(task.id));

    actionsWrapper.appendChild(editBtn);
    actionsWrapper.appendChild(deleteBtn);

    fragment.appendChild(mainContent);
    fragment.appendChild(actionsWrapper);
    return fragment;
  }

  /**
   * Creates the inline edit form for a task
   */
  function createEditForm(task) {
    const editWrapper = document.createElement('div');
    editWrapper.className = 'edit-form-wrapper';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.id = `edit-input-${task.id}`;
    editInput.value = task.text;
    editInput.setAttribute('aria-label', 'Edit task description');

    const actions = document.createElement('div');
    actions.className = 'edit-actions';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn-sm save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => saveEditedTask(task.id, editInput.value));

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-sm cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', cancelEditingTask);

    // Keyboard support: Enter saves, Escape cancels
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEditedTask(task.id, editInput.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEditingTask();
      }
    });

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    editWrapper.appendChild(editInput);
    editWrapper.appendChild(actions);

    return editWrapper;
  }

  // --------------------------------------------------------------------------
  // 12. Event Listeners Setup
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    // Add Task Form Submit
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = addTask(taskInput.value);
        if (success) {
          taskInput.value = '';
          taskInput.focus();
        }
      });
    }

    // Input change: clear error message as user types
    if (taskInput) {
      taskInput.addEventListener('input', () => {
        if (taskInput.value.trim().length > 0) {
          clearValidationError();
        }
      });
    }

    // Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        render();
      });
    });

    // Clear Completed Button
    if (clearCompletedBtn) {
      clearCompletedBtn.addEventListener('click', promptClearCompleted);
    }

    // Theme Toggle
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Modal Action Buttons
    if (modalConfirmBtn) {
      modalConfirmBtn.addEventListener('click', executePendingAction);
    }
    if (modalCancelBtn) {
      modalCancelBtn.addEventListener('click', closeModal);
    }
    if (confirmModal) {
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
          closeModal();
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 13. Application Initialization
  // --------------------------------------------------------------------------
  function init() {
    initTheme();
    loadTasksFromStorage();
    setupEventListeners();
    render();
  }

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
