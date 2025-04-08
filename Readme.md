# 📧 Email Scheduler (Automation Flow App)

An email automation tool where users can create visual workflows to schedule emails at specific intervals.  
Built with **React**, **React Flow**, **Node.js**, **Agenda**, and **Nodemailer** — featuring user authentication and backend scheduling magic.

![Workflow Example](https://res.cloudinary.com/dha7ofrer/video/upload/v1744119950/email_scheduler_snapshot/epp8vegt0wsea2i1arq5.mkv)
> Simple drag-and-drop UI for creating email automation workflows

---

## 🚀 Features

- 📬 Schedule emails visually using a flow-like interface
- ⏰ Agenda-based job scheduling
- 🔐 Secure authentication system
- 📤 Automated email sending using Nodemailer
- ⚙️ Backend-driven logic, minimal frontend distractions

---

## 🛠️ Tech Stack

### Frontend
- **React**: UI framework
- **React Flow**: Flow-based builder for automation design

### Backend
- **Node.js**: Runtime environment
- **Express.js**: REST API framework
- **Agenda**: Job scheduling for Node.js
- **Nodemailer**: Email transport and delivery
- **MongoDB**: Storage for scheduled jobs and users

---

## 📸 Screenshots

### 🖼️ Flow Builder
![Flow Builder Screenshot](https://res.cloudinary.com/dha7ofrer/image/upload/v1744117504/email_scheduler_snapshot/iair7kp792xj3rwtwlco.png)

### 📬 Email Scheduler Panel
![Email Panel Screenshot](https://res.cloudinary.com/dha7ofrer/image/upload/v1744118060/email_scheduler_snapshot/eutlka4qixqtydzmsgtw.png)

### 🔐 Authentication Page
![Auth Screenshot](https://res.cloudinary.com/dha7ofrer/image/upload/v1744118055/email_scheduler_snapshot/cq6kwevzuhlddaho3ypw.png)

> ⚠️ *Note: Styling is minimal — focus is purely on functionality.*

---

## 🧪 How It Works

1. **Login / Sign up** – Simple auth system to protect your workspace
2. **Create Email Flow** – Use the drag-and-drop builder to define:
   - Email content
   - Wait time (delays)
   - Cold email or warm follow-ups
3. **Save & Schedule** – Backend (using Agenda) registers jobs with MongoDB
4. **Send** – Nodemailer handles email dispatch at the scheduled time

---

## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/yourusername/email-schedular.git
cd email-schedular 
```

Backend Setup:
```bash
cd server
npm install
# Create a .env file with your config (PORT, MONGO_URI, EMAIL, PASSWORD)
npm start
``` 

Environment Variables:
```bash
MONGO_URI=Dmongo-db-url
EMAIL_USER=nodemailer-email
EMAIL_PASS=nodemailer-password
JWT_SECRET = jwt-secret
PORT=port
```

FrontEnd Setup:
```bash
cd client
npm install
npm run dev
```

Acknowledgements:
- **React Flow** for the flow builder
- **Agenda** for job scheduling
- **Nodemailer** for handling emails

**Live** : https://sdfsdfdffafdfsd/sdfsdfsfs


