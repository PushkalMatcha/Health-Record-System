# 🏥 HealthVault — Secure Health Record Management System

> A HIPAA-inspired Electronic Health Record (EHR) system built with production-grade AWS infrastructure, featuring end-to-end encryption, role-based access control, and a scalable cloud-native architecture.

[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Aurora](https://img.shields.io/badge/Amazon_Aurora-Database-527FFF?logo=amazonaws&logoColor=white)](https://aws.amazon.com/rds/aurora/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [AWS Infrastructure](#-aws-infrastructure)
- [Security Design](#-security-design)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Monitoring & Observability](#-monitoring--observability)
- [Project Structure](#-project-structure)

---

## 🔍 Overview

HealthVault is a full-stack Electronic Health Record system designed with **HIPAA-inspired** security and compliance principles. The system manages patient records, appointments, prescriptions, and medical history with strict access controls and audit logging.

**Key Design Principles:**
- **Security First** — encrypted data at rest and in transit, least-privilege IAM roles
- **Scalability** — Aurora RDS with read replica support, stateless Node.js backend
- **Observability** — CloudWatch dashboards, structured logging, and AWS X-Ray tracing
- **Infrastructure as Code** — all AWS resources defined in Terraform

---

## 🏗 Architecture

```
                          ┌─────────────────────────────────────────────────┐
                          │                    AWS VPC                      │
                          │                                                 │
  Users / Browsers        │  ┌──────────┐      ┌──────────────────────┐     │
        │                 │  │          │      │   Public Subnet      │     │
        ▼                 │  │  AWS WAF │─────>│                      │     │ 
  ┌──────────┐            │  │          │      │  Application Load    │     │
  │  Route53 │────────────┼─>│  (Rules) │      │  Balancer (ALB)      │     │
  │  (DNS)   │            │  │          │      │  HTTPS / ACM Cert    │     │
  └──────────┘            │  └──────────┘      └──────────┬───────────┘     │
                          │                               │                 │
                          │                    ┌──────────▼────────────┐    │
                          │                    │   Private Subnet      │    │
                          │                    │                       │    │
                          │                    │  EC2 (t3.medium)      │    │
                          │                    │  ┌─────────────────┐  │    │
                          │                    │  │  Next.js (SSR)  │  │    │
                          │                    │  │  Node.js API    │  │    │
                          │                    │  │  (Express)      │  │    │
                          │                    │  └────────┬────────┘  │    │
                          │                    └───────────┼───────────┘    │
                          │                                │                │
                          │  ┌─────────────────────────────▼─────────────┐  │
                          │  │              Database Subnet              │  │
                          │  │                                           │  │
                          │  │   ┌──────────────┐   ┌─────────────────┐  │  │
                          │  │   │ Aurora RDS   │   │  Aurora Read    │  │  │
                          │  │   │ (Primary)    │──>│  Replica        │  │  │
                          │  │   │ Writer Node  │   │  (Read-only)    │  │  │
                          │  │   └──────────────┘   └─────────────────┘  │  │
                          │  └───────────────────────────────────────────┘  │
                          │                                                 │
                          │  ┌──────────────┐  ┌────────────┐               │
                          │  │   S3 Bucket  │  │ CloudWatch │               │
                          │  │  (Documents) │  │ (Logs+Mon) │               │
                          │  └──────────────┘  └────────────┘               │
                          └─────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 (App Router, SSR) | Patient portal, doctor dashboard |
| **Backend** | Node.js + Express | REST API, business logic |
| **Database** | Amazon Aurora MySQL (RDS) | Primary data store |
| **File Storage** | Amazon S3 | Medical documents, reports |
| **Auth** | JWT + bcrypt | Authentication & session management |
| **IaC** | Terraform | Infrastructure provisioning |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Monitoring** | AWS CloudWatch + X-Ray | Logs, metrics, distributed tracing |
| **Security** | AWS WAF + Security Groups | Web firewall & network isolation |

---

## ☁️ AWS Infrastructure

### Services Used

| Service | Configuration | Purpose |
|---|---|---|
| **EC2** | t3.medium, Amazon Linux 2023 | Application hosting |
| **Amazon Aurora** | MySQL 8.0, Multi-AZ | Primary database with automated failover |
| **Aurora Read Replica** | Same region | Offload read queries, reporting |
| **Application Load Balancer** | HTTPS with ACM cert | SSL termination, traffic distribution |
| **AWS WAF** | Managed rule groups | SQL injection, XSS, rate limiting |
| **S3** | Server-side encryption (SSE-S3) | Medical document storage |
| **CloudWatch** | Custom dashboards + alarms | Monitoring and alerting |
| **AWS X-Ray** | Sampling enabled | Request tracing across services |
| **ACM** | Auto-renewal certificate | SSL/TLS for HTTPS |
| **VPC** | 3-tier subnet isolation | Network security |
| **IAM** | Least-privilege roles | Service-to-service auth |

### VPC Design

```
VPC CIDR: 10.0.0.0/16

Public Subnets (ALB):
  - 10.0.1.0/24  (ap-south-1a)
  - 10.0.2.0/24  (ap-south-1b)

Private Subnets (EC2):
  - 10.0.3.0/24  (ap-south-1a)
  - 10.0.4.0/24  (ap-south-1b)

Database Subnets (Aurora):
  - 10.0.5.0/24  (ap-south-1a)
  - 10.0.6.0/24  (ap-south-1b)
```

### Security Groups

| SG Name | Inbound | Outbound |
|---|---|---|
| `sg-alb` | 80, 443 from 0.0.0.0/0 | 3000 to sg-ec2 |
| `sg-ec2` | 3000 from sg-alb only | 3306 to sg-rds, 443 to 0.0.0.0/0 |
| `sg-rds` | 3306 from sg-ec2 only | None |

> ⚠️ EC2 has **no public IP** and is not directly accessible from the internet. All traffic routes through the ALB.

---

## 🔐 Security Design

This system is designed with HIPAA-inspired principles for handling sensitive health data:

### Encryption
- **At rest**: Aurora RDS encryption enabled (AES-256), S3 SSE-S3
- **In transit**: HTTPS enforced via ALB + ACM certificate, TLS 1.2 minimum on RDS
- **Passwords**: bcrypt with salt rounds = 12
- **JWT**: Short-lived access tokens (15 min) + refresh tokens (7 days), stored in httpOnly cookies

### Access Control
- **Role-based**: Patient, Doctor, Admin roles with scoped permissions
- **Row-level**: Patients can only access their own records
- **API**: All routes protected with JWT middleware, role checks applied per endpoint

### Audit Logging
- Every record access, modification, and deletion is logged to CloudWatch Logs
- Log format: `{ timestamp, userId, role, action, resourceId, ipAddress }`
- Log retention: 90 days
- VPC Flow Logs enabled for network traffic auditing

### WAF Rules (AWS Managed)
- AWSManagedRulesCommonRuleSet
- AWSManagedRulesSQLiRuleSet
- AWSManagedRulesKnownBadInputsRuleSet
- Rate limiting: 1000 requests / 5 min per IP

---

## ✨ Features

- **Patient Management** — register patients, manage demographics, emergency contacts
- **Health Records** — create, view, and update medical history, diagnoses, allergies
- **Appointments** — schedule, reschedule, cancel appointments with status tracking
- **Prescriptions** — issue and manage prescriptions with medication details
- **Document Upload** — upload lab reports and medical documents (stored in S3, served via presigned URLs)
- **Audit Trail** — immutable log of all record access and changes
- **Role-based Dashboard** — separate views for patients, doctors, and admins
- **Search** — full-text search on patient records (read replica used for search queries)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured (`aws configure`)
- Terraform 1.5+
- MySQL client (for local dev)

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/healthvault.git
cd healthvault

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# Run database migrations
cd ../backend
npm run migrate

# Seed development data
npm run seed

# Start backend (runs on :4000)
npm run dev

# In another terminal, start frontend (runs on :3000)
cd ../frontend
npm run dev
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
# App
NODE_ENV=development
PORT=4000

# Database (Aurora)
DB_HOST=your-aurora-cluster-endpoint.rds.amazonaws.com
DB_READ_HOST=your-aurora-reader-endpoint.rds.amazonaws.com
DB_PORT=3306
DB_NAME=healthvault
DB_USER=admin
DB_PASSWORD=your_secure_password

# Auth
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AWS
AWS_REGION=ap-south-1
AWS_S3_BUCKET=healthvault-documents-prod
AWS_XRAY_DAEMON_ADDRESS=localhost:2000

# Logging
LOG_LEVEL=info
CLOUDWATCH_LOG_GROUP=/healthvault/app/production
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=HealthVault
```

> 🔒 **Never commit `.env` files.** All secrets in production are stored in AWS Secrets Manager and injected at runtime.

---

## 📡 API Documentation

### Base URL
```
Production: https://api.yourdomain.com/api/v1
Local:      http://localhost:4000/api/v1
```

### Authentication

```
POST   /auth/register          Register a new user
POST   /auth/login             Login, receive JWT
POST   /auth/refresh           Refresh access token
POST   /auth/logout            Invalidate refresh token
```

### Patients

```
GET    /patients               List patients (Doctor/Admin only)
GET    /patients/:id           Get patient profile
POST   /patients               Create patient record
PUT    /patients/:id           Update patient record
```

### Health Records

```
GET    /records/:patientId     Get all records for a patient
POST   /records                Create a new record
PUT    /records/:id            Update a record
GET    /records/:id/audit      Get audit log for a record
```

### Appointments

```
GET    /appointments           List appointments (filtered by role)
POST   /appointments           Book an appointment
PUT    /appointments/:id       Update status (confirm/cancel/complete)
```

### Documents

```
POST   /documents/upload       Upload file to S3, returns presigned URL
GET    /documents/:id          Get presigned download URL (expires 15 min)
```

---

## 🗄 Database Schema

```sql
-- Core tables (simplified)

patients         (id, user_id, date_of_birth, blood_group, allergies, emergency_contact, created_at)
health_records   (id, patient_id, doctor_id, diagnosis, notes, visit_date, created_at, updated_at)
prescriptions    (id, record_id, medication_name, dosage, frequency, duration, issued_at)
appointments     (id, patient_id, doctor_id, scheduled_at, status, reason, created_at)
documents        (id, patient_id, record_id, s3_key, file_name, file_type, uploaded_at)
audit_logs       (id, user_id, action, resource_type, resource_id, ip_address, timestamp)
users            (id, email, password_hash, role, is_active, last_login, created_at)
```

**Read Replica usage**: All `SELECT` queries for search, reporting, and audit logs route to the reader endpoint via `DB_READ_HOST`. Write queries (INSERT, UPDATE, DELETE) always use the primary `DB_HOST`.

---

## 📦 Deployment

### Infrastructure Setup (Terraform)

```bash
cd terraform/

# Initialize
terraform init

# Preview changes
terraform plan -var-file="prod.tfvars"

# Apply
terraform apply -var-file="prod.tfvars"
```

Terraform provisions: VPC, subnets, security groups, EC2, Aurora cluster + replica, ALB, WAF, S3 bucket, IAM roles, CloudWatch log groups.

### CI/CD Pipeline (GitHub Actions)

The pipeline runs on every push and is defined in `.github/workflows/`:

```
Push to any branch:
  1. Lint (ESLint)
  2. Unit tests (Jest)
  3. Build Docker images

Merge to main:
  1. All above steps
  2. Push images to Amazon ECR
  3. SSH into EC2
  4. Pull new images and restart containers (zero-downtime)
```

### Manual Deployment

```bash
# SSH into EC2 (via Systems Manager Session Manager — no bastion needed)
aws ssm start-session --target i-xxxxxxxxxxxxxxxxx

# On EC2
cd /opt/healthvault
docker compose pull
docker compose up -d --no-deps backend frontend
```

---

## 📊 Monitoring & Observability

### CloudWatch Dashboards

A custom CloudWatch dashboard (`HealthVault-Production`) monitors:

| Metric | Alarm Threshold |
|---|---|
| EC2 CPU Utilization | > 80% for 5 min |
| Aurora Write Latency | > 100ms |
| Aurora DB Connections | > 80% of max |
| ALB 5XX Error Rate | > 1% |
| S3 4XX Errors | > 50/min |
| Estimated AWS Bill | > ₹5000/month |

### Log Groups (CloudWatch Logs)

```
/healthvault/app/production      → Application logs (structured JSON)
/healthvault/audit/production    → Audit trail logs (immutable)
/aws/rds/cluster/healthvault     → RDS slow query logs
/aws/vpc/flowlogs                → VPC network flow logs
```

### AWS X-Ray Tracing

X-Ray is instrumented in the Node.js backend using `aws-xray-sdk`. Every API request generates a trace showing:
- Express route handling time
- Aurora DB query time (per query)
- S3 operation time
- External HTTP call time

View traces at: **AWS Console → X-Ray → Service Map**

---

## 📁 Project Structure

```
healthvault/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, logging, error handling
│   │   ├── models/           # DB models (Sequelize)
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Business logic, S3, email
│   │   └── utils/            # Helpers, validators
│   ├── migrations/           # DB migration files
│   ├── tests/                # Jest unit + integration tests
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # Reusable UI components
│   ├── lib/                  # API client, auth helpers
│   ├── public/               # Static assets
│   ├── Dockerfile
│   └── package.json
├── terraform/
│   ├── main.tf               # Root module
│   ├── vpc.tf                # VPC, subnets, routing
│   ├── ec2.tf                # EC2 instance, IAM role
│   ├── rds.tf                # Aurora cluster + replica
│   ├── alb.tf                # Load balancer, target groups
│   ├── waf.tf                # WAF rules association
│   ├── s3.tf                 # Document storage bucket
│   ├── cloudwatch.tf         # Log groups, alarms, dashboard
│   ├── variables.tf
│   └── prod.tfvars
├── .github/
│   └── workflows/
│       ├── ci.yml            # Lint, test, build
│       └── cd.yml            # Deploy to EC2 on merge
├── docker-compose.yml        # Local development
├── docker-compose.prod.yml   # Production compose
└── README.md
```

---

## 👤 Author

**Your Name**
- LinkedIn: [linkedin.com/in/yourprofile](https://www.linkedin.com/in/pushkalmatcha/)
- GitHub: [github.com/PushkalMatcha](https://github.com/PushkalMatcha)
- Email: matchapushkal@gmail.com
    

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

