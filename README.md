# 🎉 Event Management System (MERN Stack)

A **full-stack Event Management Platform** built with the **MERN stack** (MongoDB, Express, React, Node.js) featuring **role-based authentication**, **event creation & registration**, and a **responsive modern UI with Tailwind CSS**.

---

## 📌 Table of Contents
- [✨ Features](#-features)
- [📂 Project Structure](#-project-structure)
- [🔧 Backend Setup](#-backend-setup)
- [🎨 Frontend Setup](#-frontend-setup)
- [🔗 Integration](#-integration)
- [📡 API Endpoints](#-api-endpoints)
- [🚀 Tech Stack](#-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🙌 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features
✅ **JWT Authentication** with Role-Based Access (Organizer & Attendee)  
✅ **Organizers:** Create, Update, Delete Events & Manage Attendees  
✅ **Attendees:** Browse, Register, and Cancel Events  
✅ **Validations:** Event Date & Capacity Check  
✅ **Responsive UI:** Built with **React + Tailwind CSS**  
✅ **Easy Configuration:** `.env` based setup for Backend & Frontend  

---

## 📂 Project Structure
```
event-management/
│── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── eventController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── eventRoutes.js
│   ├── middleware/authMiddleware.js
│   ├── server.js
│   └── package.json
│
│── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── services/api.js
│       ├── contexts/AuthContext.jsx
│       ├── components/
│       ├── pages/
│       └── utils/format.js
```

---

## 🔧 Backend Setup
### ⚙️ Installation
```bash
cd backend
npm install
```

### 📦 Dependencies
- express  
- mongoose  
- bcryptjs  
- jsonwebtoken  
- cors  
- dotenv  

### 🔑 Environment Variables
Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventdb
JWT_SECRET=your_jwt_secret
```

### ▶️ Run Server
```bash
npm start
```
Backend runs at 👉 **http://localhost:5000**

---

## 🎨 Frontend Setup
### ⚙️ Installation
```bash
cd frontend
npm install
```

### 📦 Dependencies
- react  
- react-dom  
- react-router-dom  
- axios  
- jwt-decode  
- dayjs  
- tailwindcss, postcss, autoprefixer  

### 🔑 Environment Variables
Create a `.env` file inside `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### ▶️ Run Frontend
```bash
npm run dev
```
Frontend runs at 👉 **http://localhost:5173**

---

## 🔗 Integration
1. Start **backend** on port `5000`  
2. Start **frontend** on port `5173`  
3. Frontend will call backend APIs via `VITE_API_BASE_URL`

---

## 📡 API Endpoints

### 🔐 Auth
- `POST /api/auth/signup` → Register new user  
- `POST /api/auth/login` → Login & receive JWT  

### 📅 Events
- `POST /api/events` → Create event (**Organizer only**)  
- `GET /api/events` → Get all events  
- `GET /api/events/:id` → Get single event  
- `PUT /api/events/:id` → Update event (**Organizer only**)  
- `DELETE /api/events/:id` → Delete event (**Organizer only**)  

### 📝 Registration
- `POST /api/events/:id/register` → Register for event (**Attendee only**)  
- `POST /api/events/:id/cancel` → Cancel registration (**Attendee only**)  

---

## 🚀 Tech Stack
**Frontend:** React, Tailwind CSS, Axios, Vite  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT, bcryptjs  
**Tools:** dotenv, cors  

---


---

## 🙌 Contributing
Contributions are welcome! 🚀  
1. Fork the repo  
2. Create a new branch: `git checkout -b feature-name`  
3. Commit changes: `git commit -m 'Added new feature'`  
4. Push branch: `git push origin feature-name`  
5. Create a Pull Request 🎉  

---

## 📜 License
This project is licensed under the **MIT License**.

---

💡 *Built with ❤️ using the MERN Stack*
