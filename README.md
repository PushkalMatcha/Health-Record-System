# 🏥 SVDS - Health Record System

A full-stack Health Record Management System that enables secure management of patient data, authentication, and role-based access.
Deployed on AWS with a production-ready architecture using Nginx, PM2, PostgreSQL (RDS), and CI/CD via GitHub Actions.

---

🚀 Live Demo

👉 http://13.205.90.167

---

🧠 Features

- 🔐 Authentication (Register/Login with JWT)
- 👨‍⚕️ Role-based access (Admin / User)
- 📊 Health record management
- ⚡ RESTful API integration
- 🌐 Fully deployed frontend + backend
- 🔄 Automated CI/CD pipeline
- 🛡️ Secure environment variable handling

---

🏗️ Tech Stack

Frontend

- Next.js 14
- React
- Tailwind CSS

Backend

- Node.js
- Express.js
- Prisma ORM

Database

- PostgreSQL (AWS RDS)

DevOps & Deployment

- AWS EC2 (Ubuntu)
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- GitHub Actions (CI/CD)

---

⚙️ Architecture

GitHub → GitHub Actions → EC2 → Nginx → Frontend + Backend → PostgreSQL (RDS)

---

📦 Project Setup (Local)

1. Clone repo

```bash
git clone https://github.com/your-username/Health-Record-System.git
cd Health-Record-System
```

2. Backend Setup

```bash
cd backend
npm install
```

Create ".env":

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=3000
```

Run migrations:

```bash
npx prisma migrate dev
```

Start backend:

```bash
npm run dev
```

---

3. Frontend Setup

```bash
cd frontend
npm install
```

Create ".env.local":

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Start frontend:

```bash
npm run dev
```

---

☁️ Deployment (AWS EC2)

- Deployed backend & frontend using PM2
- Configured Nginx reverse proxy
- Exposed via public IP:
  - "/" → Frontend
  - "/api" → Backend

---

🔄 CI/CD Pipeline

- Implemented using GitHub Actions
- On every push:
  - Connects to EC2 via SSH
  - Pulls latest code
  - Installs dependencies
  - Builds frontend
  - Restarts services using PM2

---

📁 Folder Structure

```text
community-connect/
│
├── app/
│   ├── api/
│   │   └── volunteers/
│   ├── dashboard/
│   ├── emergency/
│   ├── login/
│   ├── notifications/
│   ├── patients/
│   ├── reports/
│   ├── schedule/
│   ├── settings/
│   ├── visits/
│   ├── volunteer/
│   ├── volunteers/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── scripts/
│   ├── src/
│   │   ├── index.ts
│   │   └── prisma.ts
│   ├── docker-compose.yml
│   ├── package.json
│   └── tsconfig.json
│
├── components/
│   ├── ui/
│   ├── auth-guard.tsx
│   ├── auth-provider.tsx
│   ├── navbar.tsx
│   └── notifications-center.tsx
│
├── hooks/
│   └── use-auth.ts
│
├── lib/
│   ├── config.ts
│   ├── mock-patients.ts
│   └── mock-volunteers.ts
│
├── public/
├── styles/
├── types/
├── package.json
├── tsconfig.json
└── README.md
```

---

🧪 API Example

```http
POST /api/auth/register
POST /api/auth/login
```

---

🔐 Environment Variables

Backend

- "DATABASE_URL"
- "JWT_SECRET"

Frontend

- "NEXT_PUBLIC_API_URL"

---

🧠 Key Learnings

- Cloud deployment using AWS EC2
- Reverse proxy setup with Nginx
- Process management with PM2
- Database migrations with Prisma
- CI/CD automation using GitHub Actions
- Handling CORS and production configs

---

🚀 Future Improvements

- HTTPS (SSL with Certbot)
- Docker containerization
- Zero-downtime deployments
- Monitoring & logging (Grafana)

---

