# KIT Club Portal — Campus Club & Event Management System



A modern, full-stack web application designed for KIT’s College of Engineering, Kolhapur. The portal streamlines campus student activities, club recruitment drives, event registrations, interactive photo galleries, and real-time administrative oversight across all technical, cultural, sports, and social clubs.

---

## Key Features & Architecture

###  **Student Experience**
- **Club Discovery:** Browse & search all campus clubs with category filters (Technical, Cultural, Sports, Social, Entrepreneurship, Arts, etc.).
- **Detailed Club Portfolios:** View club descriptions, faculty coordinators, official contact details, core team members, and high-res past event photo galleries.
- **Event Registration:** Register for upcoming workshops and competitions with a confirmation pop-up and real-time seat availability updates.
- **Recruitment Application Engine:** Apply for active club recruitment drives with custom questionnaire prompts.

### **Club Head Dashboard**
- **Direct Cloudinary Media Uploads:** Manage club profile pictures and multi-photo event galleries with direct file upload controls (powered by Cloudinary).
- **Dynamic Question Builder:** Build, edit, reorder, delete, and set required/optional statuses for recruitment application questions.
- **Application Reviewer:** Filter, evaluate, accept, or reject student recruitment applications in real time.
- **Event Management:** Create and publish upcoming campus events with custom eligibility rules and registration deadlines.

###  **Admin & Cloud Infrastructure**
- **Role-Based Access Control (RBAC):** Distinct permissions and dashboards for `student`, `clubHead`, and `admin` users.
- **MongoDB Atlas Connectivity:** Cloud-hosted database cluster with automated seeding and upsert capabilities.
- **Direct Buffer Cloudinary Upload Service:** Memory-buffered image streaming without local file storage dependencies.



## 🚀 Tech Stack

| Layer | Technology |

| **Frontend** | React, Vite, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas Cloud Database |
| **Media Storage** | Cloudinary v2 API |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS Password Hashing |
| **Deployment** | Render (Web Service + Static Site) |

---


### 1. Clone the Repository
```bash
git clone https://github.com/Prachi-t04/KitClubs.git
cd KitClubs
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


### 5. Run Development Servers
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Dev Server (Port 5173)
cd client
npm run dev
```



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

##  Author

Developed by **Prachi Thakare** 
