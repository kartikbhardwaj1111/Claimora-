<div align="center">

# 🏥 Claimora — Minimal Claims Management Platform

### *A Production-Grade Healthcare Claims Engine Built for Patients & Insurers*

[![React](https://img.shields.io/badge/Frontend-React.js_v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS_v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://claimora-beryl.vercel.app/)

---

<p align="center">
  <a href="https://claimora-beryl.vercel.app/"><b>🌐 LIVE DEMO WEB APP</b></a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-workflow">System Workflow</a> •
  <a href="#-tech-stack-rationale">Tech Stack</a> •
  <a href="#-api-endpoints">API Spec</a>
</p>

</div>

---

## 📌 Executive Summary

**Claimora** is a dual-portal web application built for the **Aarogya ID Round 1 Task Assignment**. It bridges the gap between healthcare patients submitting medical expense claims and insurance providers reviewing, approving, or rejecting claims with custom reimbursement amounts and official remarks.

> **Company Preference Alignment**: Built using **NestJS with TypeScript** on the backend (*explicitly preferred by Aarogya ID*), connected to **MongoDB Atlas**, and paired with a crisp, responsive **React.js** frontend.

---

## 🎬 Project Demo Video Presentation

Watch the comprehensive video demonstration of the **Claimora** platform covering patient claim submission, document inspection, insurer review, and real-time status updates:

<p align="center">
  <video src="https://raw.githubusercontent.com/kartikbhardwaj1111/Claimora-/main/Project_Demo_Presentation.mp4" controls="controls" width="100%" style="max-height: 520px; border-radius: 12px; border: 1px solid #e2e8f0;"></video>
</p>

*Direct Link: [https://raw.githubusercontent.com/kartikbhardwaj1111/Claimora-/main/Project_Demo_Presentation.mp4](https://raw.githubusercontent.com/kartikbhardwaj1111/Claimora-/main/Project_Demo_Presentation.mp4)*

---

## ⚡ Key Features

### 👤 1. Patient Portal
* 📝 **Claim Submission Engine**: Capture Patient Name, Email, Requested Amount (₹), Description, and Medical Receipt attachment.
* 📎 **Multi-Format Uploads**: Drag-and-drop support for receipt images (`.png`, `.jpg`) and PDF prescriptions (`.pdf`) up to 10MB.
* 📊 **Live Status Tracking**: View submitted claims history with real-time status badges (**Pending ⏳**, **Approved ✅**, **Rejected ❌**), approved amounts, and insurer comments.

### 🛡️ 2. Insurer Portal (Claims Control Center)
* 📈 **Analytics & Overview Metrics**: Real-time summary statistics for Total Claims, Pending Reviews, Approved Reimbursement Value, and Total Claimed Value.
* 🔍 **Smart Filter & Search Toolbar**: 1-click status filtering pills (`All`, `Pending`, `Approved`, `Rejected`), multi-field search (Patient Name, Email, Claim ID), and amount/date sorting.
* 🖼️ **Inline Document Inspection**: Embedded document viewer modal to inspect uploaded receipt PDFs and images directly inside the application.
* ✍️ **Review & Decision Action Panel**: Interactive visual decision cards to Approve (with validated Approved Amount ≤ Claimed Amount) or Reject with official reviewer remarks.

### ⚡ 3. Evaluator Experience (Recruiter Feature)
* 🔘 **1-Click Role Switcher**: Header bar toggle allowing assignment reviewers to switch between `Demo Patient` and `Demo Insurer` roles instantly without typing credentials.
* 📦 **Auto-Seed Database Command**: Run `npm run seed` to automatically populate MongoDB Atlas with demo patients, insurers, and sample claims.

---

## 🔄 System Workflow

```
┌──────────────────────────┐          ┌──────────────────────────┐          ┌──────────────────────────┐
│                          │          │                          │          │                          │
│     PATIENT PORTAL       │          │      NESTJS BACKEND      │          │   MONGO-DB ATLAS CLOUD   │
│                          │          │                          │          │                          │
│  1. Submit Claim Form    │=========>│  Save Uploaded Receipt   │=========>│  Store Claim Document    │
│     & Upload Receipt     │  (POST)  │  in /uploads Directory   │          │  (Status: Pending)       │
│                          │          │                          │          │                          │
└──────────────────────────┘          └──────────────────────────┘          └──────────────────────────┘
                                                    │                                     │
                                                    │ (Fetch Queue)                       │ (Read & Update)
                                                    ▼                                     ▼
                                      ┌──────────────────────────┐          ┌──────────────────────────┐
                                      │                          │          │                          │
                                      │      INSURER PORTAL      │          │  Insurer Decision Updates│
                                      │                          │=========>│  - Status (Approved)     │
                                      │  2. Inspect Document     │ (PATCH)  │  - Approved Amount       │
                                      │     Approve / Reject     │          │  - Official Remarks      │
                                      └──────────────────────────┘          └──────────────────────────┘
```

### End-to-End Data Flow Steps:
1. **Patient Claim Submission**: The patient fills in claim details and attaches a prescription/receipt file. The React client posts `multipart/form-data` to NestJS.
2. **File & Data Storage**: NestJS stores the uploaded receipt file in the `/uploads` directory and inserts a new claim record with status `Pending` into **MongoDB Atlas**.
3. **Insurer Queue & Review**: The insurer switches to the Insurer Portal, views summary analytics, inspects the receipt inline in the modal viewer, and submits a review decision.
4. **Real-time Status Sync**: NestJS updates the claim document in MongoDB Atlas, and the patient's dashboard instantly reflects **Approved ✅** or **Rejected ❌** with reviewer comments.

---

## 🛠️ Tech Stack Rationale

| Layer | Technology | Rationale & Advantage |
| :--- | :--- | :--- |
| **Frontend** | **React.js** (Vite) | Single Page Application architecture, fast HMR, modular components, crisp Vanilla CSS styling. |
| **Backend** | **NestJS** (TypeScript) | **Company Preferred Backend**. Enterprise architecture with Controllers, Services, DTO validation pipes, and Mongoose schemas. |
| **Database** | **MongoDB Atlas** | Cloud document database providing flexible schema storage and global availability. |
| **File Handling** | **Multer & Static Serve** | Stores receipts/prescriptions in `/uploads` and serves them securely via URL. |
| **Auth** | **JWT & Bcrypt** | Secure role-based authorization plus instant 1-Click Demo Login Switcher. |

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB Atlas URI** (configured in `server/.env`)

---

### Step 1: Start Backend Server (`server/`)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Build TypeScript project
npm run build

# Seed database with sample patients, insurers & claims
npm run seed

# Start NestJS development server
npm run start:dev
```
> 🌐 **Backend Server running on**: `http://localhost:5001`

---

### Step 2: Start Frontend Client (`client/`)

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
> 💻 **Frontend Web App running on**: `http://localhost:5173`

---

## 🌐 API Endpoints Contract

<details>
<summary><b>Click to expand full REST API Specs</b></summary>

<br />

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new patient or insurer |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT token |
| `POST` | `/api/auth/demo-login` | Public | Instant 1-click demo login (`patient` or `insurer`) |

### Claims Routes (`/api/claims`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/claims` | Patient | Submit claim request with receipt file upload |
| `GET` | `/api/claims/my-claims` | Patient | Fetch claims submitted by logged-in patient |
| `GET` | `/api/claims` | Insurer | Fetch all claims (with `status`, `search`, `minAmount` filters) |
| `GET` | `/api/claims/:id` | Shared | Fetch single claim details |
| `PATCH` | `/api/claims/:id/review` | Insurer | Update claim status (`Approved`/`Rejected`), approvedAmount, comments |

</details>

---

<div align="center">

### Built with ❤️ for the Aarogya ID Placement Task Submission

</div>
