# Taqwa Center - Full Stack Application

A beautiful, modern, and responsive full-stack application for Taqwa Center built with React, Vite, Tailwind CSS, and Express.js.

## 🏗️ Project Structure

```
Taqwa-Center/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/
│   │   │   └── index.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable)

2. **Install Frontend Dependencies:**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies:**
```bash
cd ../backend
npm install
```

4. **Set up Environment Variables:**
```bash
# In the backend directory
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

#### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

#### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm start
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🎨 Features

### Frontend
- ✅ Fully responsive design
- ✅ Smooth animations with Framer Motion
- ✅ Sticky navigation bar
- ✅ Modern Islamic-themed design
- ✅ Smooth scrolling navigation
- ✅ Mobile-friendly menu
- ✅ Beautiful footer with contact information

### Backend
- ✅ RESTful API structure
- ✅ CORS enabled for frontend communication
- ✅ Health check endpoint
- ✅ Contact form endpoint
- ✅ Programs and Services endpoints
- ✅ Error handling middleware
- ✅ Environment variable configuration

## 📡 API Endpoints

- `GET /api` - API information
- `GET /api/health` - Health check
- `POST /api/contact` - Submit contact form
- `GET /api/programs` - Get programs list
- `GET /api/services` - Get services list

## 🎯 Development

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run dev` - Start development server with watch mode
- `npm start` - Start production server

## 📝 License

This project is created for Taqwa Center.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
