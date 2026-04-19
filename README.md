# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
```
HRMS - Job Portal & Management System

A full-stack Human Resource Management System (HRMS) featuring a robust Job Portal. This application allows Admins/HR to manage job postings and track applications, while candidates can browse and apply for roles.


🚀 Features

- **Job Management**: Create, view, and delete job postings with real-time updates.
- **Server-Side Pagination**: Optimized data fetching for both Jobs and Applications (5 items per page).
- **Application Tracking**: Candidates can apply with resume links; Admins can Approve or Reject applications.
- **Role-Based Access**: Specialized views for Admins, HR, and Candidates.
- **Real-time Notifications**: Instant alerts for application status changes.
- **Responsive UI**: Built with Tailwind CSS and Lucide React icons for a modern feel.

🛠️ Tech Stack

**Frontend:**
- React (TypeScript)
- Tailwind CSS
- Lucide React (Icons)
- Axios (API Calls)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- Cloudinary (File Management)
- JWT (Authentication)

---

## 💻 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites
- Node.js installed on your machine.
- A MongoDB Atlas account.

📂 Project Structure
Frontend
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ api
│  │  └─ axiosInstance.ts
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ AddEmployeeModal.tsx
│  │  ├─ AddLeaveModal.tsx
│  │  ├─ DashboardViews.tsx
│  │  ├─ MainLayout.tsx
│  │  ├─ Navbar.tsx
│  │  ├─ NotificationBell.tsx
│  │  ├─ ProtectedRoute.tsx
│  │  └─ Sidebar.tsx
│  ├─ context
│  │  └─ NotificationContext.tsx
│  ├─ features
│  │  ├─ attendance
│  │  │  └─ attendanceService.ts
│  │  ├─ auth
│  │  │  └─ authSlice.ts
│  │  ├─ dashboard
│  │  │  └─ dashboardService.ts
│  │  ├─ employees
│  │  │  └─ employeeService.ts
│  │  ├─ jobs
│  │  │  └─ jobService.ts
│  │  ├─ leaves
│  │  │  └─ leaveService.ts
│  │  └─ users
│  │     └─ userService.ts
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ Attendance.tsx
│  │  ├─ Dashboard.tsx
│  │  ├─ Employees.tsx
│  │  ├─ Holidays.tsx
│  │  ├─ JobManagement.tsx
│  │  ├─ LandingPage.tsx
│  │  ├─ Leaves.tsx
│  │  ├─ Login.tsx
│  │  ├─ Register.tsx
│  │  └─ Settings.tsx
│  ├─ store
│  │  ├─ hooks.ts
│  │  └─ strore.ts
│  └─ utils
│     └─ validationSchemas.ts
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```