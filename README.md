# 🏛️ KIT Club Portal

> A modern, full-stack campus club management and event portal built for **Kolhapur Institute of Technology (KIT)**.

---

## 🌟 Key Features

- **🔐 Role-Based Access Control (RBAC):** Distinct roles & dashboards for **Students**, **Club Heads**, and **Super Admins**.
- **🏛️ Dynamic Club Profiles:** Customize club logos, past event photo galleries, faculty coordinators, contact emails, and social media handles.
- **📅 Event Registration System:** Create and manage upcoming events with eligibility rules, capacity limits, confirmation popups, and live seat counters.
- **💼 Recruitment Engine:** Club heads can design, edit, reorder, and evaluate custom application prompts; students apply seamlessly.
- **☁️ Cloudinary Media Integration:** Upload club logos and event photos directly to Cloudinary cloud storage.
- **🗄️ Cloud Database:** Powered by MongoDB Atlas with automated email notification fallbacks.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Lucide Icons, Axios, React Router v6
- **Backend:** Node.js, Express.js (ESM), Mongoose
- **Database:** MongoDB Atlas
- **Media Storage:** Cloudinary API
- **Auth & Security:** JWT (JSON Web Tokens), BcryptJS password hashing

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/kit-club-portal.git
cd kit-club-portal
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory based on `.env.example`:
```bash
cp server/.env.example server/.env
```
Fill in your `MONGODB_URI`, `JWT_SECRET`, and Cloudinary credentials.

### 3. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run Development Servers
```bash
# Start backend server (Port 5000)
cd server
npm run dev

# In a new terminal, start frontend dev server (Port 5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser!
