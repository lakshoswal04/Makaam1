# Makaam 🎯  
Your Personalized AI-Powered Career Roadmap Platform

Makaam is an AI-powered platform that helps students explore, plan, and confidently pursue their ideal careers. By generating personalized learning and career roadmaps based on individual interests, skills, and goals, Makaam simplifies the overwhelming world of career planning into a clear, actionable journey.

---

## 📚 Table of Contents
- [Features](#-features)
- [Target Users](#-target-users)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [API & AI Usage](#-api--ai-usage)
- [Contribution Guidelines](#-contribution-guidelines)
- [Contact](#-contact)
- [License](#-license)

---

## 🚀 Features

### 🌱 Personalized Roadmaps
- AI-powered roadmap based on user input (education, interests, goals, skills).
- Clear 4-phase structure: *Learn → Practice → Build → Apply*.
- Includes curated topics, tools, projects, and resource links.

### 📚 Curated Resource Library
- Categorized by domain (e.g., Data Science, Web Dev, Design).
- Mix of free & premium courses, articles, GitHub repos, etc.

### ✅ Weekly Check-Ins & Progress Tracker
- Mark roadmap milestones as completed.
- Weekly check-ins to keep users accountable.
- Streaks & encouragement system to keep users accountable.

### 🎓 Admin Dashboard (Optional)
- Admin can add resources and can see premium or freemium resources.

---

## 🧑‍🎓 Target Users

- 📌 High school and college students exploring career options.
- 🔁 Graduates looking to upskill or pivot careers.
- 🚀 Self-taught learners who want structured guidance and resources.

---

## 🛠 Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | React.js, TailwindCSS            |
| Backend     | Node.js, Express.js              |
| Database    | MongoDB (Atlas)                  |
| Auth        |  Auth (JWT Token)  |
| AI          | Groq API (AI for roadmap/check-ins) |
| Hosting     | Netlify (frontend), Render (backend) |

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone 
cd makaam

## Install dependencies 

cd backend
npm install

cd ../frontend
npm install


GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_PRIVATE_KEY = your_key
PORT = 5173
SALT = 

# Start Frontend
cd frontend
npm run dev

# Start Backend (in another terminal)
cd backend
npm run dev
