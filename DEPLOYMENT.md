# ScholarSwarm Cloud Deployment Guide

This guide explains how to deploy both the **ScholarSwarm FastAPI Backend** and the **React Vite Frontend** to the cloud with free or low-cost hosting.

---

## 🚀 Option 1: 1-Click Automated Deployment on Render (Recommended)

Render provides free hosting for both web services (backend) and static sites (frontend). The included [`render.yaml`](./render.yaml) automatically deploys both services and connects them together.

### Step 1: Push Code to a GitHub Repository
If you haven't pushed the project to GitHub yet:
```bash
# Inside C:\Users\sanja\.gemini\antigravity-ide\scratch\scholarswarm:
git init
git add .
git commit -m "Initial commit for ScholarSwarm platform"
git branch -M main
git remote add origin https://github.com/<your-username>/scholarswarm.git
git push -u origin main
```

### Step 2: Deploy Blueprint on Render
1. Go to [render.com](https://render.com) and sign in.
2. Click **New +** in the top navigation and select **Blueprint**.
3. Connect your `scholarswarm` GitHub repository.
4. Render will detect [`render.yaml`](./render.yaml) and automatically create:
   - **`scholarswarm-backend`** (Python 3.11 FastAPI Web Service)
   - **`scholarswarm-frontend`** (Static Site with automatic rewrite rules)
5. Click **Apply**.
6. Render will build and deploy both services! Once finished, Render will display your live public URLs:
   - Frontend: `https://scholarswarm-frontend.onrender.com`
   - Backend: `https://scholarswarm-backend.onrender.com`

---

## ⚡ Option 2: Vercel (Frontend) + Render / Railway (Backend)

For ultra-fast global CDN delivery, you can host the frontend on Vercel and the backend on Render or Railway.

### Step 1: Deploy Backend on Render
1. Go to [render.com](https://render.com) -> **New +** -> **Web Service**.
2. Select your GitHub repository.
3. Configure the backend service:
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**.
5. Copy your backend URL once live: (e.g. `https://scholarswarm-backend.onrender.com`).

### Step 2: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New...** -> **Project** and select your repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
4. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://scholarswarm-backend.onrender.com` *(your Render backend URL)*
5. Click **Deploy**.
6. Vercel will build the frontend with zero-configuration routing (using [`vercel.json`](./frontend/vercel.json)).

---

## 🐳 Option 3: Docker Compose (Any VPS / DigitalOcean / AWS EC2)

To run the full stack containerized on a cloud virtual machine:

```bash
# Clone and enter directory
git clone https://github.com/<your-username>/scholarswarm.git
cd scholarswarm

# Build and start both containers in background
docker compose up --build -d
```

- Frontend will be live on `http://<your-vps-ip>:3000`
- Backend API will be live on `http://<your-vps-ip>:8000`

---

## 🔒 Environment Variables Reference

| Variable | Service | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Frontend | `http://localhost:8000` | Public URL of the FastAPI backend API |
| `PORT` | Backend | `8000` | Port for Uvicorn server |
| `ENABLE_CACHE` | Backend | `true` | Enables SQLite response caching for web crawler |
