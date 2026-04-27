<p align="center">
  <img src="https://img.shields.io/badge/Nexus-CRM-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlnb24gcG9pbnRzPSIxMyAyIDMgMTQgMTIgMTQgMTEgMjIgMjEgMTAgMTIgMTAgMTMgMiI+PC9wb2x5Z29uPjwvc3ZnPg==&logoColor=white" alt="Nexus CRM" />
</p>

<h1 align="center">Nexus CRM</h1>

<p align="center">
  <strong>A modern, full-stack Customer Relationship Management platform built for sales, support, and management teams.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Express.js-4-000000?style=flat-square&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/JWT-Auth-red?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [API Reference](#-api-reference)
- [Authentication & Roles](#-authentication--roles)
- [Pages & Modules](#-pages--modules)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Nexus CRM** is a production-ready, SaaS-style CRM web application that helps businesses manage the complete customer lifecycle — from lead capture to deal closure and beyond. It provides a unified workspace for sales pipelines, task management, communication tracking, analytics, and team collaboration.

### Who is it for?

| Role | Use Case |
|------|----------|
| **Sales Executives** | Manage leads, track deals, log calls & emails |
| **Sales Managers** | Monitor team performance, review pipeline health |
| **Support Agents** | Handle customer issues, track tasks, log communications |
| **Admins** | Configure system settings, manage users & roles |

---

## ✨ Features

### Core Modules

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | JWT login/signup, forgot/reset password, session handling |
| 📊 **Dashboard** | 8 stat cards, revenue charts, deal distribution, activity feed |
| ⚡ **Lead Management** | Full CRUD, status pipeline, source tracking, lead-to-customer conversion |
| 👥 **Customer Management** | Company profiles, deal history, communication logs, notes |
| 🤝 **Deal Pipeline** | Kanban drag-and-drop board with 6 stages, list view toggle |
| ✅ **Task Management** | Assignments, priorities, due dates, completion tracking |
| 📅 **Calendar** | Monthly grid view with tasks, meetings, and follow-ups |
| 📈 **Reports & Analytics** | 8 chart types, CSV export, top performers leaderboard |
| 💬 **Communications** | Call/email/meeting logs with duration & outcome tracking |
| 🔔 **Notifications** | In-app alerts, unread badges, auto-polling every 30s |
| ⚙️ **Settings** | Company profile, user management, role permissions, theme |
| 👤 **Profile** | Edit personal info, change password |

### Advanced Features

- 🌗 **Light & Dark Mode** — system-aware theme switching
- 🔍 **Global Search** — search across leads, customers, and deals
- 📱 **Responsive Design** — works on desktop, tablet, and mobile
- 🏷️ **Tags & Labels** — organize records with custom tags
- 📂 **Soft Delete** — archive records instead of permanent deletion
- 🔒 **Role-Based Access** — 4 roles with granular route protection
- 📄 **Pagination** — efficient data loading across all list views
- 🔄 **Real-time Ready** — notification polling with WebSocket-ready architecture

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Radix UI](https://www.radix-ui.com/) | Accessible headless components |
| [Recharts](https://recharts.org/) | Data visualization |
| [Lucide Icons](https://lucide.dev/) | Icon system |
| [Axios](https://axios-http.com/) | HTTP client |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark mode |

### Backend

| Technology | Purpose |
|-----------|---------|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express.js](https://expressjs.com/) | Web framework |
| [MongoDB](https://www.mongodb.com/) | Database |
| [Mongoose](https://mongoosejs.com/) | ODM |
| [JWT](https://jwt.io/) | Authentication tokens |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [express-validator](https://express-validator.github.io/) | Input validation |
| [Helmet](https://helmetjs.github.io/) | Security headers |

---

## 📁 Project Structure

```
crm software/
├── server/                         # ── Backend API ──
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── index.js                # Environment config
│   ├── controllers/
│   │   ├── authController.js       # Login, register, password reset
│   │   ├── userController.js       # User CRUD
│   │   ├── leadController.js       # Lead management + conversion
│   │   ├── customerController.js   # Customer management
│   │   ├── dealController.js       # Pipeline + Kanban
│   │   ├── taskController.js       # Task lifecycle
│   │   ├── activityController.js   # Activity timeline
│   │   ├── communicationController.js
│   │   ├── notificationController.js
│   │   ├── reportController.js     # Analytics aggregations
│   │   ├── calendarController.js   # Aggregated events
│   │   └── settingController.js    # Company settings
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification
│   │   ├── roleAuth.js             # Role-based access
│   │   ├── errorHandler.js         # Global error handler
│   │   └── validate.js             # Request validation
│   ├── models/
│   │   ├── User.js                 # Users (bcrypt, JWT methods)
│   │   ├── Lead.js                 # Leads (text search index)
│   │   ├── Customer.js             # Customers (address, industry)
│   │   ├── Deal.js                 # Deals (pipeline stages)
│   │   ├── Task.js                 # Tasks (polymorphic relations)
│   │   ├── Activity.js             # Audit trail
│   │   ├── Communication.js        # Call/email/meeting logs
│   │   ├── Notification.js         # In-app notifications
│   │   └── Setting.js              # System configuration
│   ├── routes/                     # 12 route files
│   ├── seeders/
│   │   └── seed.js                 # Sample data generator
│   ├── utils/
│   │   ├── apiResponse.js          # Standardized responses
│   │   └── pagination.js           # Mongoose pagination helper
│   ├── app.js                      # Express app setup
│   ├── server.js                   # Entry point
│   ├── package.json
│   └── .env
│
└── client/                         # ── Frontend App ──
    └── src/
        ├── app/
        │   ├── layout.tsx          # Root layout (Inter font, providers)
        │   ├── providers.tsx       # Theme + Auth providers
        │   ├── globals.css         # Tailwind + custom styles
        │   ├── page.tsx            # Root redirect
        │   ├── login/              # Login page
        │   ├── signup/             # Registration page
        │   ├── forgot-password/    # Password recovery
        │   ├── dashboard/          # Main dashboard
        │   ├── leads/              # Lead list + [id] detail
        │   ├── customers/          # Customer list + [id] detail
        │   ├── deals/              # Kanban pipeline
        │   ├── tasks/              # Task management
        │   ├── calendar/           # Monthly calendar
        │   ├── reports/            # Analytics & charts
        │   ├── communications/     # Communication logs
        │   ├── notifications/      # Notification center
        │   ├── settings/           # Admin settings
        │   └── profile/            # User profile
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.tsx     # Collapsible nav sidebar
        │   │   ├── TopBar.tsx      # Search, notifications, profile
        │   │   └── DashboardLayout.tsx
        │   └── ui/                 # Reusable UI components
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── badge.tsx
        │       ├── dialog.tsx
        │       ├── input.tsx
        │       ├── select.tsx
        │       ├── textarea.tsx
        │       └── skeleton.tsx
        └── lib/
            ├── api.ts              # Axios instance + interceptors
            ├── auth.tsx            # Auth context & provider
            └── utils.ts            # Formatting & helper functions
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** 6+ (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** 9+

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "crm software"
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure Environment

```bash
# Copy and edit the backend env file
cd server
# Edit .env with your MongoDB URI and JWT secret
```

### 4. Seed the Database

```bash
cd server
npm run seed
```

This creates **150+ sample records** including users, leads, customers, deals, tasks, activities, communications, and notifications.

### 5. Start the Application

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 3000)
cd client
npm run dev
```

### 6. Open the App

Navigate to **http://localhost:3000** in your browser.

---

## 🔐 Environment Variables

### Backend (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | API server port |
| `MONGODB_URI` | `mongodb://localhost:27017/crm_db` | MongoDB connection string |
| `JWT_EXPIRE` | `7d` | Token expiration period |
| `NODE_ENV` | `development` | Environment mode |
| `CLIENT_URL` | `http://localhost:3000` | CORS origin |

### Frontend (`client/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## 🌱 Database Seeding

The seed script (`server/seeders/seed.js`) generates:

| Collection | Count | Details |
|-----------|-------|---------|
| Users | 10 | 1 Admin, 2 Managers, 5 Sales, 2 Support |
| Leads | 25 | All statuses and sources represented |
| Customers | 15 | 10 industries, realistic companies |
| Deals | 20 | All 6 pipeline stages |
| Tasks | 30 | Mixed priorities and statuses |
| Activities | 50 | Timeline entries across all modules |
| Communications | 30 | Calls, emails, meetings |
| Notifications | 50 | 5 per user, mixed read/unread |
| Settings | 1 | Company configuration |

Run the seeder:

```bash
cd server
npm run seed
```

---

## 📡 API Reference

### Base URL

```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Login (returns JWT) |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update profile |
| PUT | `/auth/change-password` | Change password |
| POST | `/auth/forgot-password` | Request reset token |
| POST | `/auth/reset-password` | Reset with token |

### Users

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/users` | Admin, Manager |
| GET | `/users/list` | All authenticated |
| GET | `/users/:id` | All authenticated |
| PUT | `/users/:id` | Admin |
| DELETE | `/users/:id` | Admin (soft delete) |

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | List with search/filter/pagination |
| GET | `/leads/stats` | Status & source statistics |
| GET | `/leads/:id` | Get lead details |
| POST | `/leads` | Create lead |
| PUT | `/leads/:id` | Update lead |
| DELETE | `/leads/:id` | Archive lead |
| POST | `/leads/:id/notes` | Add note |
| POST | `/leads/:id/convert` | Convert to customer |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List with search/filter |
| GET | `/customers/stats` | Customer statistics |
| GET | `/customers/:id` | Get customer details |
| POST | `/customers` | Create customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Archive customer |
| POST | `/customers/:id/notes` | Add note |

### Deals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/deals` | List all deals |
| GET | `/deals/pipeline` | Grouped by stage (Kanban) |
| GET | `/deals/stats` | Deal statistics |
| GET | `/deals/:id` | Get deal details |
| POST | `/deals` | Create deal |
| PUT | `/deals/:id` | Update deal |
| PUT | `/deals/:id/stage` | Update stage (drag-drop) |
| DELETE | `/deals/:id` | Archive deal |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List with filters |
| GET | `/tasks/stats` | Task statistics |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| PUT | `/tasks/:id/complete` | Mark complete |
| DELETE | `/tasks/:id` | Archive task |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activities` | List with filters |
| GET | `/activities/recent` | Latest activities |
| POST | `/activities` | Log activity |

### Communications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/communications` | List with filters |
| POST | `/communications` | Log communication |
| PUT | `/communications/:id` | Update |
| DELETE | `/communications/:id` | Delete |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | User's notifications |
| GET | `/notifications/unread-count` | Badge count |
| PUT | `/notifications/:id/read` | Mark as read |
| PUT | `/notifications/read-all` | Mark all read |
| DELETE | `/notifications/:id` | Delete |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/dashboard` | Dashboard summary stats |
| GET | `/reports/lead-conversion` | Lead status funnel |
| GET | `/reports/lead-sources` | Source performance |
| GET | `/reports/sales-performance` | Revenue by user |
| GET | `/reports/deal-stages` | Stage distribution |
| GET | `/reports/revenue` | Monthly revenue trends |
| GET | `/reports/task-completion` | Completion rates |
| GET | `/reports/customer-growth` | Growth over time |
| GET | `/reports/top-performers` | Sales leaderboard |
| GET | `/reports/won-vs-lost` | Win/loss comparison |

### Calendar

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/calendar/events` | Aggregated events |

### Settings

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/settings` | All authenticated |
| PUT | `/settings` | Admin only |

---

## 🔑 Authentication & Roles

### Login Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | `admin@crm.com` | `password123` |
| 📋 Manager | `manager@crm.com` | `password123` |
| 💼 Sales Executive | `james@crm.com` | `password123` |
| 🎧 Support Agent | `lisa@crm.com` | `password123` |

### Role Permissions

| Feature | Admin | Manager | Sales Exec | Support |
|---------|:-----:|:-------:|:----------:|:-------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Leads | ✅ | ✅ | ✅ (own) | ❌ |
| Customers | ✅ | ✅ | ✅ (own) | ✅ (own) |
| Deals | ✅ | ✅ | ✅ (own) | ❌ |
| Tasks | ✅ | ✅ | ✅ (own) | ✅ (own) |
| Calendar | ✅ | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | ❌ | ❌ |
| Communications | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |

---

## 📸 Pages & Modules

### Authentication
- **Login** — Split-screen design with branding + form, demo credentials box
- **Signup** — Clean registration card with validation
- **Forgot Password** — Email-based reset flow with success state

### Dashboard
- 8 metric cards with trend indicators (+/-%)
- Revenue trend area chart with gradient fill
- Deal stages donut chart with legend
- Lead sources horizontal bar chart
- Recent activity feed with type badges
- Quick action buttons

### Lead Management
- Searchable data table with status/source/priority filters
- Add/Edit modal with all fields
- Detail page with notes, tags, activity timeline
- One-click lead-to-customer conversion

### Customer Management
- Filterable table by status and industry
- Detail page with linked deals, communications, notes
- Account manager assignment
- Revenue tracking per customer

### Deal Pipeline
- **Kanban Board** — drag cards between 6 stages
- Stage totals (count + value) in column headers
- Probability progress bar on each card
- Toggle to list/table view
- Create deal with customer + owner selection

### Task Management
- Card-based list with checkbox completion
- Overdue highlighting (red border)
- Completed tasks with strikethrough + opacity
- Priority & status badges
- Create with assignment and due date

### Calendar
- Monthly grid with event dots (color-coded by type)
- Today highlighting
- Upcoming events list sidebar
- Events sourced from tasks, meetings, and follow-ups

### Reports & Analytics
- Lead conversion funnel bar chart
- Lead source pie chart
- Monthly revenue area chart
- Deal distribution bar chart
- Task completion donut chart
- Won vs Lost deal comparison
- Top sales performers leaderboard
- CSV export per section

### Communications
- Card-based log with type icons (📞 Call, 📧 Email, 👥 Meeting)
- Duration and outcome tracking
- Filter by communication type
- Log new communication modal

### Notifications
- Notification cards with emoji type icons
- Unread highlighting with left border accent
- Mark as read (individual + bulk)
- Delete notifications
- Filter: All / Unread

### Settings (Admin)
- **Company** — name, email, phone, website, address, currency
- **Users** — user list table with role badges and status
- **Roles** — permission descriptions per role
- **Theme** — light/dark/system selector

### Profile
- Avatar with initials + gradient background
- Edit name, phone, department, bio
- Change password form

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Next.js, Express.js, and MongoDB
</p>
