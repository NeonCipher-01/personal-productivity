# Personal Productivity App 🚀

A full-stack web application built with **Express**, **React**, and **MongoDB** to help you organize your tasks, habits, and goals.

## 📋 Features

- **Task Management**: Create, update, and delete daily tasks.
- **Habit Tracking**: Build positive habits with daily tracking.
- **Goal Setting**: Set and monitor your long-term goals.
- **User Authentication**: Secure registration and login system.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Axios
- **Database**: MongoDB (Local)

## 🏃 Getting Started

### Prerequisites
- Node.js & npm
- MongoDB (running locally or remote)

### Installation

1. **Clone the repository** (if you haven't already).

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Create .env file based on .env.example
   cp .env.example .env 
   # Edit .env with your MongoDB URI and PORT
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   ```

### Running the App

Start both servers simultaneously or in separate terminals.

**Method 1: Separate Terminals**
```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd client
npm start
```

**Method 2: Using `concurrently`** (if installed in root)
```bash
npm run dev
```

The app will be accessible at `http://localhost:3000`.

## 📂 Project Structure

```
/personal-productivity
├── server/            # Backend (Express + MongoDB)
│   ├── config/        # Database connection
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   └── server.js      # Entry point
├── client/            # Frontend (React)
│   ├── src/
│   │   ├── api/       # API configuration
│   │   ├── components/ # UI components
│   │   ├── pages/     # Route pages
│   │   ├── contexts/  # State management
│   │   └── App.js     # Main component
└── package.json       # Root dependencies (if any)
```

## 📚 Usage

1. Open `http://localhost:3000` in your browser.
2. **Register** a new account.
3. **Login** with your credentials.
4. Start managing your tasks, habits, and goals!
