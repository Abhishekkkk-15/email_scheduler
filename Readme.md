# 📧 Email Scheduler (Automation Flow App)

Workflow-Driven Email Automation Platform

Email Scheduler is a visual email automation system that lets you design, schedule, and execute email workflows with real-time status tracking.
It combines a node-based workflow builder with a BullMQ + Redis worker architecture for reliable, scalable background execution.

<p align="center">
<img src="https://res.cloudinary.com/dha7ofrer/image/upload/v1768291431/icon_aiyomx.svg" alt="logo" width="400">
</p>

## Demo
https://email-scheduler-oqpk.vercel.app/dashboard

## ✨ Highlights

- 🧩 Visual workflow builder (React Flow–style)
- 🛠️ Real-time execution status via WebSockets
- ⚡ CSV or single-recipient support
- 🐂 BullMQ + Redis powered job queue
- 🧵 Dedicated background workers
- 📬 Template-based emails with variables
- ⏳ Delays & follow-ups handled automatically
- 📊 Live execution history & task counters
- 🔐 Google OAuth authentication

---

## 🚀 Core Features

### Workflow Builder
- Workflow Builder
- Supported nodes:
    - Lead Source
    - Wait (delay)
    - Cold Email
    - Follow-up Email
- Clear visual flow with node sequencing
### Email Automation
- CSV or single-recipient support
- Reusable email templates
- Variable placeholders ({{name}}, {{company}})
- Single email or CSV recipient support
- Resend-based delivery

### BullMQ Job System
- Each workflow execution becomes a queue job
- Redis-backed persistence
- Retries & failure handling ready
- Scales horizontally with workers

### Background Workers
- Workers live inside backend service
- Responsible for:
    - Sending emails
    - Emitting live status events
- Decoupled from API request lifecycle

### Live Status Tracking
- Socket events emitted from workers

- Status flow:
    - QUEUED
    - PROCESSING
    - SENDING
    - SENT
    - FAILED
- Animated status badges in UI

### Execution History
- Per-flow execution logs
- Live task count updates
- Node sequence preview
- Flow deletion & cleanup
---

## 📸 Screenshots

### 🖼️ Dashboard
![Dashboard](https://res.cloudinary.com/dha7ofrer/image/upload/v1768294120/222_hwkn96.jpg)

### 🧩 Flow Builder
![Builder](https://res.cloudinary.com/dha7ofrer/image/upload/v1768293260/mail-scheduler_mofbfd.jpg)

###  ⚡ Email Scheduler Panel
![Email Panel Screenshot](https://res.cloudinary.com/dha7ofrer/image/upload/v1768293260/node_dz6fgr.jpg)

### 📬 Template Builder
![Template Builder](https://res.cloudinary.com/dha7ofrer/image/upload/v1768294187/re_qq8m4b.jpg)

### 🔐 Execution History
![Execution History](https://res.cloudinary.com/dha7ofrer/image/upload/v1768293260/3_sp4jnk.jpg)

---

## 🧪 How It Works

1. Sign In
    Authenticate with Google to access your workspace.

2. Build Workflow
    Create a flow using nodes:
    - Define templates
    - Add delays
    - Configure follow-ups

3. Save & Run
  - Workflow is persisted
  - BullMQ job is created
  - Job enters Redis queue

4. Worker Executes
- Worker processes nodes sequentially
- Sends emails
- Applies delays
- Emits socket events
5. Track Live Execution
- UI updates in real time as tasks progress.
---

## 🛠️ Tech Stack
### Frontend
- Next.js
- React Flow
- shadcn/ui
- Socket.IO (client)

## Backend
- Node.js
- Express.js
- MongoDB
- Redis
- BullMQ
- Resend
- socket.IO (server)

## Auth
- NextAuth.js
- Google Auth

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/Abhishekkkk-15/email-schedular.git
cd email-schedular 
```

### Backend Setup:
```bash
cd server
pnpm install
```
Create .env:
```env
MONGO_URI=
JWT_SECRET=
RESEND_API_KEY=
SENDER_EMAIL=
PORT=
REDIS_URL=
FRONTEND_DOMAIN=
```
Start Backend/Workers:
```bash
pnpm start
```
> Workers run inside the backend process and listen to BullMQ queues.

### Frontend Setup:

```bash
cd server
pnpm install
```
Create .env

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_BACKEND_URL=
MONGODB_URL=
NEXTAUTH_SECRET=
REDIS_URL=
```
Start Frontend:
```bash
pnpm start
```




## Authors

- [@abhishekkkk](https://www.github.com/abhishekkkk-15)
**Abhishek Jangid**

- Backend-focused Full Stack Developer

🔗 LinkedIn: https://www.linkedin.com/in/abhishek-jangid-3532b1323
## License

[MIT](https://choosealicense.com/licenses/mit/)

