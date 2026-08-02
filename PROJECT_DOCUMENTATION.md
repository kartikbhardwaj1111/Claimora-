# Claimora - Minimal Claims Management Platform

> **Project Documentation & Architecture Guide**  
> *Prepared for Aarogya ID Round 1 Task Submission*

---

## 1. Project Overview

**Claimora** is a web application designed to streamline healthcare insurance claims processing. It provides two dedicated interfaces:

1. **Patient Portal**: Allows patients to submit medical expense claims (with receipt or prescription uploads) and track their claim approval status.
2. **Insurer Portal**: Enables insurance reviewers to inspect submitted claims, view uploaded documents, filter/sort claims, and approve or reject claims with custom approved amounts and comments.

---

## 2. Technology Stack

* **Frontend**: React.js (built with Vite for fast performance)
* **Backend**: NestJS (Node.js framework with TypeScript)
* **Database**: MongoDB (with Mongoose ODM)
* **File Storage**: Local server directory (`/uploads`) for receipt & prescription files
* **Authentication**: Role-based JSON Web Tokens (JWT) + 1-Click Demo Login Switcher

---

## 3. How the System Works (Workflow)

```
+------------------+         +-------------------+         +------------------+
|                  |         |                   |         |                  |
|  PATIENT PORTAL  |         |  NESTJS BACKEND   |         | MONGO-DB DATABASE|
|                  |         |                   |         |                  |
| 1. Submit Claim  |=======> | Save file to      |=======> | Save Claim       |
|    Form & Upload | (POST)  | /uploads folder   |         | (Status: Pending)|
|    Receipt       |         |                   |         |                  |
+------------------+         +-------------------+         +------------------+
                                       ||                           ||
                                       || (GET Claims)              || (Read/Update)
                                       \/                           \/
                             +-------------------+         +------------------+
                             |                   |         |                  |
                             |  INSURER PORTAL   |         | Insurer Updates: |
                             |                   |========>| - Status         |
                             | 2. Inspect Claim  | (PATCH) | - Approved Amt   |
                             |    Approve/Reject |         | - Comments       |
                             +-------------------+         +------------------+
```

---

## 4. Key Features

### A. Patient Interface
* **Submit a Claim**:
  * Fields: Full Name, Email Address, Claim Amount (₹/$), Description.
  * Upload Document: Drag-and-drop receipt or prescription file (Images: PNG, JPG or Document: PDF).
* **View & Track Claims**:
  * Real-time dashboard showing all submitted claims.
  * Status badges: **Pending ⏳**, **Approved ✅**, **Rejected ❌**.
  * Shows Submission Date, Approved Amount, and Insurer Remarks.

### B. Insurer Interface
* **Claims Dashboard**:
  * Overview metrics: Total Claims, Total Value, Pending Approvals, Total Approved Amount.
  * Filters: Filter claims by Status (All, Pending, Approved, Rejected).
  * Search & Sort: Search by Patient Name/Email, sort by Date or Claim Amount.
* **Manage Claims**:
  * Review Panel: View full claim details and preview uploaded receipt/prescription.
  * Action Form: Approve or Reject claim, enter Approved Amount, and leave comments.

### C. Demo Login Switcher (Evaluator Feature)
* A top header bar allowing evaluators to switch between **Demo Patient** and **Demo Insurer** with a single click.

---

## 5. Database Structure

### User Model (`user.schema.ts`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | User's full name |
| `email` | String | User's email address (Unique) |
| `passwordHash` | String | Encrypted password |
| `role` | String | User role (`patient` or `insurer`) |

### Claim Model (`claim.schema.ts`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `claimId` | String | Unique Claim Code (e.g. `CLM-1042`) |
| `patientName` | String | Name of the patient |
| `patientEmail` | String | Email of the patient |
| `claimAmount` | Number | Requested claim amount |
| `approvedAmount`| Number | Amount approved by insurer |
| `description` | String | Reason / description for claim |
| `documentUrl` | String | File path of uploaded receipt |
| `status` | String | Claim status (`Pending`, `Approved`, `Rejected`) |
| `insurerComments`| String | Remarks left by insurer |
| `submissionDate` | Date | Date when claim was submitted |

---

## 6. API Endpoints

### Authentication
* `POST /api/auth/register` — Create new account
* `POST /api/auth/login` — Login user
* `POST /api/auth/demo-login` — Quick demo login (`patient` or `insurer`)

### Claims
* `POST /api/claims` — Submit new claim with document upload
* `GET /api/claims/my-claims` — Get claims submitted by patient
* `GET /api/claims` — Get all claims for insurer (supports status filter & search)
* `GET /api/claims/:id` — Get single claim details
* `PATCH /api/claims/:id/review` — Insurer update status, approved amount, & comments

---

## 7. Quick Setup Guide

### 1. Backend Setup
```bash
cd server
npm install
npm run seed       # Creates sample patients, insurers & claims
npm run start:dev  # Runs backend server on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev        # Runs React web app on http://localhost:5173
```
