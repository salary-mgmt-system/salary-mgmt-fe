# Salary Management System — Frontend

The web interface for the Employee Salary Management System, enabling HR managers to manage compensation data, track salary changes, and analyse compensation trends across the organisation.

Built with **React**, **TypeScript**, **Material UI**, and **Recharts**.

### 🌐 Live Demo

| | URL |
|--|-----|
| **Frontend** | https://salary-mgmt-fe.vercel.app/ |
| **Backend API** | https://salary-mgmt-be.onrender.com/api |
| **Swagger Docs** | https://salary-mgmt-be.onrender.com/api/docs |

---

## Table of Contents

- [Features](#features)
- [Features Beyond Requirements](#-features-beyond-requirements)
- [Tech Stack](#tech-stack)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Project Structure](#project-structure)
- [Scripts Reference](#scripts-reference)

---

## Features

### 1. Employee Management
- Paginated employee table with configurable page size
- Real-time search across name, employee code, and email
- Dropdown filters for country and department
- Column sorting
- Click-through to employee details

### 2. Employee Details & Salary Management
- Employee profile card with personal and role information
- Current compensation breakdown (base salary + bonus)
- Salary update dialog with validation and reason tracking
- Full salary change history timeline

### 3. Compensation Analytics Dashboard
- KPI stat cards: total employees, average, median, highest, lowest salary
- Interactive bar chart — salary by country
- Interactive bar chart — salary by department
- Salary bracket distribution chart (USD-normalised)

### 4. Salary Insights / Query Assistant
- Chat-style interface for asking compensation questions
- Clickable example question chips for quick exploration
- Natural-language answers rendered in a message bubble
- Supported queries:
  - *"What is the average salary in {country}?"*
  - *"Which department has the highest average salary?"*
  - *"How many employees earn more than {threshold}?"*
  - *"Who are the top 10 highest-paid employees?"*

---

## ⭐ Features Beyond Requirements

The following capabilities were **not part of the original requirements** but were added to improve user experience and code quality:

| Feature | Description |
|---------|-------------|
| **Material UI Theming** | Custom dark theme with consistent colour palette, typography, and component overrides |
| **TanStack Query Caching** | Automatic request deduplication, background refetching, and stale-while-revalidate for all API calls |
| **Recharts Visualisations** | Interactive, responsive charts for country, department, and distribution analytics |
| **Salary Update Dialog** | Modal form with real-time validation, error messages, and success feedback — not just a plain form |
| **Salary History Timeline** | Styled timeline view with old → new salary, percentage change, reason, and effective date |
| **Loading & Error States** | Skeleton loaders, spinners, and user-friendly error messages throughout the app |
| **Responsive Layout** | Sidebar navigation with responsive drawers (temporary toggleable menu on mobile, permanent on desktop) |
| **Component-Level Tests** | 6 test suites with 100% test coverage covering all UI paths, forms, empty states, and errors |
| **Styled Components Architecture** | Separated `.styles.ts` files for every page and component — no inline styles |
| **GitHub Actions CI/CD** | Automated pipeline with 4 jobs: install → build → lint + tests, plus auto-deploy to Vercel on merge to `main` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| UI Library | Material UI 9 (MUI) |
| Data Fetching | TanStack Query 5 |
| Routing | React Router 7 |
| Charts | Recharts 2 |
| Styling | Emotion + Styled Components |
| Testing | Vitest 4 + React Testing Library |
| CI/CD | GitHub Actions |
| Deployment | Vercel (auto-deploy on merge) |

---

## Pages

### Dashboard (`/`)
Organisation-wide compensation overview with KPI stat cards and three interactive charts (country, department, distribution).

### Employees (`/employees`)
Paginated table with search, country/department filters, and column sorting. Each row links to the employee detail page.

### Employee Details (`/employees/:id`)
Full employee profile, current salary, salary update dialog, and salary change history timeline.

### Insights (`/insights`)
Chat-style question interface with example chips. Submits questions to the backend insights API and displays natural-language answers.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 22.0.0
- **npm**
- Backend API running on `http://localhost:3000` (see [backend README](../be/README.md))

### 1. Install Dependencies

```bash
cd fe
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

### Configuration

The frontend connects to the backend API via the `VITE_API_BASE_URL` environment variable.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Backend API base URL |

---

## Testing

6 test suites covering all pages and shared components, achieving **100% statement, branch, function, and line coverage**.

```bash
npm run test          # Run all tests
npm run test:cov      # Run with coverage report
```

### Test Coverage

The frontend maintains **100% code coverage**. Shared UI helpers like `EmptyState` and `ErrorPanel` are tested integration-style directly within the page suites.

| Suite | What it tests |
|-------|--------------|
| `Layout.spec.tsx` | Navigation rendering, active states, and mobile menu toggle |
| `Employees.spec.tsx` | Table rendering, pagination, search, filtering, and empty/error states |
| `EmployeeDetails.spec.tsx` | Profile display, salary info, change history, dialog triggers, and empty/error panels |
| `SalaryUpdateDialog.spec.tsx` | Form validation, base/bonus rules, submission states, and error handling |
| `Dashboard.spec.tsx` | KPI stats cards calculation and chart rendering |
| `Insights.spec.tsx` | Query assistant prompt selection, chat messages, loading, and response rendering |

---

## CI/CD Pipeline

GitHub Actions automates quality checks on every push and pull request to `main`.

**Workflow:** `.github/workflows/ci.yml`

```
install ──► build ──┬──► lint
                    └──► test (unit + coverage)
                              │
                    ┌─────────┘
                    ▼
                  deploy (Vercel — main branch only)
```

| Job | What it does |
|-----|-------------|
| **install** | `npm ci` with node_modules caching |
| **build** | Verifies `tsc -b && vite build` compiles and bundles successfully |
| **lint** | Runs ESLint on all source files |
| **test** | Runs Vitest with coverage report |
| **deploy** | Builds and deploys to Vercel using the Vercel CLI (only on push to `main` after all checks pass) |

---

## Project Structure

```
fe/
├── src/
│   ├── api/                    # API client functions
│   │   └── api.ts              # All backend API services & types
│   ├── components/             # Shared components
│   │   ├── EmptyState.tsx      # Empty state UI fallback
│   │   ├── EmptyState.styles.ts
│   │   ├── ErrorPanel.tsx      # API error UI fallback
│   │   ├── ErrorPanel.styles.ts
│   │   ├── Layout.tsx          # App shell with responsive sidebar navigation
│   │   ├── Layout.styles.ts
│   │   ├── SalaryUpdateDialog.tsx # Modal form for salary updates
│   │   └── SalaryUpdateDialog.styles.ts
│   ├── pages/                  # Route-level pages
│   │   ├── Dashboard.tsx       # Analytics dashboard
│   │   ├── Employees.tsx       # Employee listing & table
│   │   ├── EmployeeDetails.tsx # Employee profile & salary history
│   │   └── Insights.tsx        # Query assistant chat
│   ├── theme/                  # MUI theme configuration
│   │   └── theme.ts            # Custom Material-UI theme setup
│   ├── App.tsx                 # Routes and providers
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run all tests |
| `npm run test:cov` | Run tests with coverage |

---

## Requirements Checklist

Cross-reference with the [requirement document](../docs/requirement-document.md):

| Requirement | Status |
|-------------|--------|
| View all employees in a paginated list | ✅ |
| Search by name, employee code, email | ✅ |
| Filter by country and department | ✅ |
| View detailed employee profiles | ✅ |
| View current salary | ✅ |
| Update salary with effective date | ✅ |
| Salary change audit history | ✅ |
| Total employee count dashboard | ✅ |
| Average, median, highest, lowest salary | ✅ |
| Salary distribution by country | ✅ |
| Salary distribution by department | ✅ |
| Overall salary range distribution | ✅ |
| Question-based insights interface | ✅ |
| Responsive web interface | ✅ |
| Clean, maintainable, testable codebase | ✅ |
