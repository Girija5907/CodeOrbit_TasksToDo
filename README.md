# Girija_TodoApp — Modern Responsive To-Do List Web Application

A clean, modern, and fully responsive To-Do List web application created for the **CodeOrbit Internship Submission**.

Built strictly using **vanilla HTML5, CSS3, and JavaScript (ES6+)** with **zero external libraries or frameworks**. All task data and user preferences are automatically stored and persisted in the browser using the **Web Storage API (`localStorage`)**.

---

## 📌 Project Overview

- **Project Name:** Girija_TodoApp
- **Application Title:** Tasks To Do
- **Subtitle:** Organize your tasks. Stay productive.
- **Author:** Girija
- **Purpose:** CodeOrbit Frontend Development Internship Project
- **Architecture:** Client-Side Single Page Application (Pure Vanilla Web Technologies)

---

## ✨ Features

1. **Task Management (CRUD Operations):**
   - **Add Task:** Create new tasks via the input field by clicking the "Add Task" button or pressing <kbd>Enter</kbd>.
   - **Input Validation:** Prevents empty or whitespace-only submissions and displays an accessible inline warning.
   - **Edit Task:** Edit task titles inline with dedicated **Save** and **Cancel** buttons, or keyboard shortcuts (<kbd>Enter</kbd> to save, <kbd>Escape</kbd> to cancel).
   - **Delete Task with Confirmation:** Prevents accidental deletion via an accessible confirmation dialog showing the task title.
   - **Complete / Incomplete Toggle:** Custom accessible checkbox instantly updates status with smooth visual strikethrough styling.

2. **Real-Time Task Filtering:**
   - **All Tasks:** View every task currently saved.
   - **Pending:** Filter to only unfinished tasks.
   - **Completed:** Filter to only finished tasks.
   - Live badge counters on each filter button indicate matching task counts.

3. **Metrics & Progress Tracking:**
   - **Summary Counters:** Live counter tiles showing Total, Pending, and Completed tasks.
   - **Dynamic Progress Bar:** Visual bar indicating the completion percentage and ratio (e.g., `2 of 3 tasks · 67%`).
   - **Clear Completed:** Single-click action to remove all completed tasks with a confirmation prompt.

4. **Persistence with `localStorage`:**
   - All tasks and their completion status survive browser refreshes, tab closures, and computer restarts.
   - Theme preferences are also saved and restored across sessions.

5. **Design & UX Polish:**
   - Soft, modern background with a tasteful **indigo/blue and violet** accent palette.
   - **Dark Mode / Light Mode Toggle:** Smooth theme switcher with custom SVGs and persistent storage.
   - **Feedback Toasts:** Slide-in status notifications when tasks are added, modified, completed, or deleted.
   - **Helpful Empty States:** Domain-tailored empty states when no tasks match the selected filter.
   - **100% Responsive:** Optimized fluid layout for mobile phones, tablets, and desktop monitors.
   - **Safe DOM Manipulation:** Employs safe DOM methods (`textContent`, `createElement`) to prevent Cross-Site Scripting (XSS).

---

## 🛠️ Technologies Used

| Technology | Role |
| :--- | :--- |
| **HTML5** | Semantic markup (`<main>`, `<header>`, `<section>`, `<ul>`, `<form>`, `<dialog>`), ARIA labels, and accessible attributes |
| **CSS3** | Modern CSS Variables (Design Tokens), Flexbox, CSS Grid, custom checkbox styling, transitions, and media queries |
| **JavaScript (ES6+)** | Pure Vanilla JS, IIFE module encapsulation, Event Delegation, DOM API, and `localStorage` API |

*No React, Angular, Vue, jQuery, Bootstrap, Tailwind, or backend dependencies are required.*

---

## 📁 Project Folder Structure

```text
Tasks_TodoApp/
├── index.html       # Semantic HTML5 markup, accessible landmarks, and modal dialog
├── style.css        # Clean CSS3 design system with light/dark theme variables & responsiveness
├── script.js        # Pure Vanilla JavaScript handling state, DOM updates, and localStorage
└── README.md        # Comprehensive project documentation and internship review guide
```

---

## 🚀 How to Run the Application Locally

You can run this application immediately without installing Node.js, npm, or any build tools!

### Option 1: Direct File Launch (Fastest)
1. Download or extract the project folder `Tasks_TodoApp`.
2. Locate the file `index.html`.
3. Double-click `index.html` (or right-click → **Open With** → Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
4. The application will immediately launch in your browser!

### Option 2: Using VS Code Live Server (Recommended for Development)
1. Open **Visual Studio Code**.
2. Click **File** → **Open Folder...** and select `Tasks_TodoApp`.
3. If you have the **Live Server** extension installed:
   - Right-click `index.html` in the Explorer sidebar.
   - Select **Open with Live Server**.
4. The application will launch at `http://127.0.0.1:5500`.

### Option 3: Using Python HTTP Server (Terminal)
Open your terminal in the `Tasks_TodoApp` directory and run:
```bash
# Python 3
python3 -m http.server 8000

# or Python 2
python -m SimpleHTTPServer 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 💾 How `localStorage` Preserves Tasks

The application uses the browser's native **Web Storage API (`window.localStorage`)** to persist task items and preferences directly on the user's device:

1. **Serialization (`saveTasksToStorage`):**
   - The in-memory JavaScript array of task objects (`[{ id, text, completed, createdAt }]`) is converted into a JSON string using `JSON.stringify(tasks)`.
   - It is stored under the unique key `'girija_todo_tasks'`:
     ```javascript
     localStorage.setItem('girija_todo_tasks', JSON.stringify(tasks));
     ```

2. **Deserialization (`loadTasksFromStorage`):**
   - On initial page load (`DOMContentLoaded`), the application retrieves the stored string:
     ```javascript
     const stored = localStorage.getItem('girija_todo_tasks');
     ```
   - It safely parses the string back into an object array with `JSON.parse(stored)`.
   - Error handling (`try...catch`) guards against corrupted data or private browsing storage limitations.

3. **Theme Preference Persistence:**
   - The selected theme (`'light'` or `'dark'`) is saved under the key `'girija_todo_theme'`.
   - On subsequent visits, the saved theme is applied immediately before render, preventing screen flickering.

---

## 📤 Step-by-Step Instructions to Upload to GitHub

Follow these steps to submit your project on GitHub for CodeOrbit:

### Step 1: Initialize Git Repository
Open your terminal or command prompt in the `Tasks_TodoApp` directory:
```bash
cd Tasks_TodoApp
git init
```

### Step 2: Stage and Commit the Files
```bash
git add .
git commit -m "Initial commit: CodeOrbit To-Do List Web Application"
```

### Step 3: Create a New GitHub Repository
1. Log in to your [GitHub](https://github.com/) account.
2. Click the **+** (plus icon) in the top right corner and choose **New repository**.
3. Name your repository: `Girija_TodoApp` (or `CodeOrbit-TodoApp`).
4. Keep it **Public** so evaluators can inspect your code and preview it.
5. Leave "Initialize this repository with a README" **unchecked** (we already have a complete README).
6. Click **Create repository**.

### Step 4: Link and Push to GitHub
Copy the commands shown under "...or push an existing repository from the command line":
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/Girija_TodoApp.git
git push -u origin main
```

### Step 5: (Optional) Enable GitHub Pages for Free Live Demo
1. In your GitHub repository, click **Settings** (gear tab).
2. On the left sidebar, click **Pages**.
3. Under **Branch**, select `main` branch and `/ (root)` folder, then click **Save**.
4. Within 1–2 minutes, your project will be live at:
   `https://<YOUR_GITHUB_USERNAME>.github.io/Girija_TodoApp/`

---

## 🧪 Testing Instructions

Verify that all requirements are met:

| Test Case | Steps to Test | Expected Result |
| :--- | :--- | :--- |
| **1. Add Task** | Type "Submit report" and press <kbd>Enter</kbd> or click "Add Task" | Task appears in the list; toast notifies success; input clears |
| **2. Empty Input Validation** | Click "Add Task" with an empty or spaces-only input | Input highlights in red; inline warning displays; no task added |
| **3. Toggle Completion** | Click checkbox next to a task | Strikethrough applies; pending/completed counters update immediately |
| **4. Edit Task** | Click the pencil icon on a task | Input field appears with current text; edit and press Save or <kbd>Enter</kbd> |
| **5. Cancel Edit** | Click edit, make changes, then click "Cancel" or <kbd>Escape</kbd> | Original task text restored without modification |
| **6. Delete Task** | Click the trash icon | Confirmation modal opens; clicking "Delete Task" removes it safely |
| **7. Filters** | Switch between "All Tasks", "Pending", and "Completed" | Only matching tasks show; counter badges match reality |
| **8. Refresh Persistence** | Refresh browser (<kbd>F5</kbd> / <kbd>Ctrl+R</kbd>) | All tasks, edits, and completion statuses remain intact |
| **9. Theme Toggle** | Click the Moon/Sun icon in the header | Theme smoothly switches between light and dark; persists on refresh |
| **10. Clear Completed** | Complete several tasks and click "Clear Completed" | Prompts confirmation; removes all finished tasks in one click |

---

## ✅ CodeOrbit Requirements Checklist

- [x] **Project Name:** Girija_TodoApp
- [x] **Core Functionality:** Add, edit, delete, and mark tasks as complete/incomplete
- [x] **Storage:** Browser `localStorage` persistence with safe JSON parsing
- [x] **Tech Stack:** 100% Vanilla HTML5, CSS3, and JavaScript (no frameworks)
- [x] **Structure:** Clean separation of concerns (`index.html`, `style.css`, `script.js`, `README.md`)
- [x] **Header:** App name "Tasks To Do", subtitle "Organize your tasks. Stay productive.", and task icon
- [x] **Add Task Area:** Input with "Enter a new task...", "Add Task" button, and validation message
- [x] **Task Filters:** All Tasks, Pending, and Completed filters with real-time badges
- [x] **Task Summary:** Live counts for Total, Pending, and Completed tasks
- [x] **Empty State:** Friendly messages when no tasks match the filter
- [x] **Extra Features:** Progress indicator bar, clear completed tasks button, toast alerts, dark/light theme toggle, and project export
- [x] **UI/UX Design:** Modern blue/violet palette, accessible contrast, smooth transitions, and mobile responsive

---

## 📄 License & Attribution

Designed and developed by **Girija** for the **CodeOrbit Internship Program**. Open source under the MIT License.
