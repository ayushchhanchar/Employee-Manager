 👨‍💼 Employee Manager

A modern and responsive Employee Management System built with **React**, **Recoil**, **Tailwind CSS**, and **JWT Authentication**. It features role-based access (Admin & Employee), secure login, attendance tracking, and streamlined leave request workflows — all integrated with a RESTful API backend.

---

## 🚀 Features

✅ **JWT Authentication** – Secure login with protected routes  
✅ **Role-Based Access Control** – Different dashboards for Admins & Employees  
✅ **Employee Profile Management** – Add, view, update, delete profiles  
✅ **Attendance Tracking** – Employees can log attendance; Admins can monitor  
✅ **Leave Request System** – Submit, track, approve/reject leaves  
✅ **Responsive UI** – Mobile-first design using Tailwind CSS  
✅ **Recoil State Management** – Efficient global state handling

---

## 🛠️ Tech Stack

| Layer       | Technology                            |
|-------------|----------------------------------------|
| Frontend    | React, TypeScript, Recoil              |
| Styling     | Tailwind CSS                           |
| Routing     | React Router DOM                       |
| Auth        | JWT, Role-Based Access                 |
| API Comm.   | Axios or Fetch (RESTful API)           |

---

## 📁 Folder Structure

Employee-Manager/
├── public/
├── src/
│ ├── components/ → UI components (navbar, cards, etc.)
│ ├── pages/ → Page-level views (Login, Dashboard, etc.)
│ ├── recoil/ → Atoms & selectors for global state
│ ├── routes/ → ProtectedRoute and role-based access
│ ├── services/ → API functions
│ ├── App.tsx
│ └── index.tsx
├── .env
├── tailwind.config.js
└── package.json

yaml
Copy
Edit

---

## 🔐 Authentication Flow

1. 🔑 User logs in with credentials  
2. 🪪 Backend returns a JWT token  
3. 🧠 Token is stored in `localStorage`  
4. 🔐 Routes and API requests are protected using token  
5. 🧑‍⚖️ Admin vs Employee views are controlled via roles

---

## 📦 Installation & Setup

### ✅ Prerequisites
- Node.js (v14+)
- Backend REST API (e.g., Node.js, Django, etc.)

### 📥 Clone & Install

```bash
git clone https://github.com/ayushchhanchar/Employee-Manager.git
cd Employee-Manager
npm install
🌐 Add .env File
env
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000/api
▶️ Start Development Server
bash
Copy
Edit
npm run dev
🔍 Key Components
File / Component	Description
ProtectedRoute.tsx	Guards routes based on auth/role
authService.ts	Handles login, logout, token storage
employeeAtom.ts	Global state for user info with Recoil
LeaveForm.tsx	Form to submit leave requests
AttendanceLogger.tsx	Component to mark daily attendance

🌱 Future Improvements
📊 Admin Analytics Dashboard

📨 Email Notifications (for leaves)

📄 Export to PDF/CSV

📆 Calendar Integration

🌍 Multi-language Support

🧠 What I Learned
Implementing centralized auth using JWT + React + Recoil

Creating modular UI components with Tailwind CSS

Securing app with Protected Routes and Role Guards

Managing global state in large apps using Recoil cleanly

