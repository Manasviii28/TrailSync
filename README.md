# TrailSync - Track. Improve. Connect.

TrailSync is a fitness and self-improvement web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed for personal progress and health habit building, TrailSync avoids competitive leaderboards to foster a positive, supportive environment for users tracking physical activities, setting weekly targets, participating in wellness challenges, following friends, and messaging one-to-one.

---

## 🌟 Key Features

- **🔐 User Authentication**: Register, Login, Logout using JWT tokens stored securely in HTTP-only cookies and bcrypt password hashing.
- **🏃 Live Activity Tracking**: Track Walking, Running, and Cycling workouts with live timers, speed, and real-time distance calculations using the Browser Geolocation API (Haversine formula).
- **🛡️ Manual Fallback Mode**: Graceful fallback to manual distance input if GPS is unavailable or location permission is denied.
- **🔥 Calorie Estimation**: Transparent MET-based calorie calculations tailored to activity type, duration, and user weight.
- **📊 Interactive Dashboard**: Visual weekly progress bar chart (Recharts), today's summary card, recent workouts list, and quick-start actions.
- **🎯 Personal Goals**: Set weekly distance or workout count targets with visual progress bars.
- **🏆 Wellness Challenges**: Browse, join, and complete habit-building challenges without toxic public leaderboards.
- **👥 Friends & Follows**: Search community members, follow/unfollow fellow fitness enthusiasts, and view followers/following stats.
- **💬 1-on-1 Messaging**: REST-based private message conversations between friends.
- **👤 Profile Management**: Customize fitness goals, body metrics (age, height, weight), profile picture, and view aggregate workout statistics.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Axios, Recharts, Lucide React icons, CSS3 (Vite build tool)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM), JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `dotenv`, `cors`

---

## 📁 Project Structure

```
TrailSync/
├── backend/
│   ├── config/          # MongoDB connection handler
│   ├── controllers/     # API request handlers (auth, profile, activities, goals, challenges, users, messages)
│   ├── middleware/      # JWT protection & error handler
│   ├── models/          # Mongoose Schemas (User, Profile, Activity, Goal, Challenge, ChallengeParticipation, Follow, Message)
│   ├── routes/          # Express API endpoints
│   ├── utils/           # Haversine formula, MET calorie calculator, seed script
│   ├── server.js        # Main Express server entry point
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, ProtectedRoute
│   │   ├── context/     # AuthContext (user session management)
│   │   ├── hooks/       # useGeolocation (GPS tracker & Haversine accumulation)
│   │   ├── layouts/     # MainLayout
│   │   ├── pages/       # Home, Login, Register, Dashboard, TrackActivity, ActivityHistory, Goals, Challenges, Friends, Messages, Profile
│   │   ├── services/    # Axios API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend `.env` (`/backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/trailsync
JWT_SECRET=trailsync_secret_key_2026_fitness_app
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🚀 Installation & Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 or a Cloud MongoDB Atlas connection string.

### 2. Backend Setup & Run

```bash
cd backend
cmd /c npm install

# (Optional) Seed sample challenges and demo accounts
cmd /c npm run seed

# Run Backend Server
cmd /c npm run dev
```
The backend server runs on **http://localhost:5000**.

### 3. Frontend Setup & Run

Open a separate terminal:

```bash
cd frontend
cmd /c npm install

# Run Frontend Vite Server
cmd /c npm run dev
```
The frontend web application runs on **http://localhost:5173**.

---

## 📍 Activity Tracking & Geolocation Explanation

1. **GPS Mode**: Uses `navigator.geolocation.watchPosition` to record periodic latitude and longitude coordinates during an active workout.
2. **Haversine Distance**: Calculates the great-circle distance between successive GPS points:
   $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
3. **Calorie Formula**: Uses standard Metabolic Equivalent of Task (MET) rates:
   $$\text{Calories} = \text{MET} \times \text{weight (kg)} \times \text{duration (hours)}$$
   - Walking: ~3.5 MET
   - Running: ~8.0 MET
   - Cycling: ~6.0 MET
4. **Manual Fallback**: Automatically activates if GPS permission is denied or device location hardware is disabled.

---

## 🔮 Future Enhancements

- GPX/KML route export and interactive map visualization (Leaflet/Mapbox).
- Audio cues during workouts for pace and interval notifications.
- Push notifications for message alerts and goal reminders.
