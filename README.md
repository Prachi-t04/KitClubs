# 🎓 KIT Club Portal — Campus Club & Event Management System

[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-black?style=flat-square&logo=render)](https://render.com)
[![React](https://img.shields.io/badge/Frontend-React_18_(Vite)-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_(Express)-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary_API-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)

A modern, full-stack web application designed for **KIT’s College of Engineering, Kolhapur**. The portal streamlines campus student activities, club recruitment drives, event registrations, interactive photo galleries, and real-time administrative oversight across all technical, cultural, sports, and social clubs.

---

## 🌟 Key Features & Architecture

### 🎓 **Student Experience**
- **Club Discovery:** Browse & search all campus clubs with category filters (Technical, Cultural, Sports, Social, Entrepreneurship, Arts, etc.).
- **Detailed Club Portfolios:** View club descriptions, faculty coordinators, official contact details, core team members, and high-res past event photo galleries.
- **Event Registration:** Register for upcoming workshops and competitions with a confirmation pop-up and real-time seat availability updates.
- **Recruitment Application Engine:** Apply for active club recruitment drives with custom questionnaire prompts.

### 🛡️ **Club Head Dashboard**
- **Direct Cloudinary Media Uploads:** Manage club profile pictures and multi-photo event galleries with direct file upload controls (powered by Cloudinary).
- **Dynamic Question Builder:** Build, edit, reorder, delete, and set required/optional statuses for recruitment application questions.
- **Application Reviewer:** Filter, evaluate, accept, or reject student recruitment applications in real time.
- **Event Management:** Create and publish upcoming campus events with custom eligibility rules and registration deadlines.

### ⚡ **Admin & Cloud Infrastructure**
- **Role-Based Access Control (RBAC):** Distinct permissions and dashboards for `student`, `clubHead`, and `admin` users.
- **MongoDB Atlas Connectivity:** Cloud-hosted database cluster with automated seeding and upsert capabilities.
- **Direct Buffer Cloudinary Upload Service:** Memory-buffered image streaming without local file storage dependencies.

---

## 🔑 Demo & Test Credentials

You can use the pre-seeded accounts below for testing live or in local development:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@kitkop.edu.in` | `adminpass123` |
| **Club Head (Coding / Mavericks)** | `head.coding@kitkop.edu.in` | `headpassword123` |
| **Club Head (NSS)** | `head.robotics@kitkop.edu.in` | `headpassword123` |
| **Club Head (Cultural Club)** | `head.music@kitkop.edu.in` | `headpassword123` |
| **Club Head (E-Cell)** | `head.ecell@kitkop.edu.in` | `headpassword123` |

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6 |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose |
| **Database** | MongoDB Atlas Cloud Database |
| **Media Storage** | Cloudinary v2 API (Buffer Upload Stream) |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS Password Hashing |
| **Deployment** | Render (Web Service + Static Site) |

---

## 🛠️ Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas database cluster URI
- Cloudinary account credentials

### 1. Clone the Repository
```bash
git clone https://github.com/Prachi-t04/KitClubs.git
cd KitClubs
```

### 2. Configure Backend Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Seed the Database
Populate your MongoDB Atlas database with the 12 KIT clubs and default test accounts:
```bash
cd ../server
node seed.js
```

### 5. Run Development Servers
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Dev Server (Port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser!

---

## 📡 API Endpoints Overview

| Route | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | `POST` | Register a new student account | Public |
| `/api/auth/login` | `POST` | Authenticate user & get JWT token | Public |
| `/api/clubs` | `GET` | Fetch all clubs | Public |
| `/api/clubs/:id` | `GET` | Fetch detailed club profile | Public |
| `/api/clubs/:id` | `PUT` | Update club profile & gallery | Club Head / Admin |
| `/api/events` | `GET` / `POST` | Fetch or create events | Public / Club Head |
| `/api/events/:id/register` | `POST` | Register for an event | Student |
| `/api/recruitments` | `GET` / `POST` | Manage recruitment drives | Public / Club Head |
| `/api/upload` | `POST` | Upload single image to Cloudinary | Authenticated |
| `/api/upload/multiple` | `POST` | Upload multiple gallery photos | Authenticated |

---

## 🌐 Deploying on Render

1. **Deploy Backend (Web Service):**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET`.

2. **Deploy Frontend (Static Site):**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add Environment Variable: `VITE_API_URL` = `https://your-backend-service.onrender.com`
   - Add Redirect Rewrite Rule: `/*` -> `/index.html` (200 Rewrite)

---

## 👩‍💻 Author

Developed by **Prachi Thakare** ([@Prachi-t04](https://github.com/Prachi-t04))
