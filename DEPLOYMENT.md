# Aura Pixel — Production Deployment Guide

This guide details instructions to compile, run, and host the custom full-stack **Aura Pixel** digital agency platform on modern cloud container networks (e.g., Google Cloud Run, Render, Fly.io, or Heroku).

---

## 1. System Specifications & Run Command
Aura Pixel uses a high-performance, single-process, full-stack architecture:
- **Backend**: Node.js + Express + Local file-backed database storage.
- **Frontend**: Vite + React 19 + Tailwind CSS + Framer Motion.
- **Production Bundle Pipeline**: 
  - Compiles React into optimized static assets in `/dist`.
  - Compiles the Express TypeScript backend into a single, self-contained, high-performance CommonJS file at `/dist/server.cjs` via `esbuild`.

### Required Environment Variables
Configure these secrets in your production hosting panel:
- `ADMIN_EMAIL`: Set your secure administrator email (Default: `aurapixeltech@gmail.com`).
- `ADMIN_PASSWORD`: Set your secure administrator credential code (Default: `9055772208`).
- `PORT`: Set by the cloud provider (typically `3000` or `8080`).

---

## 2. Local Production Build & Run Execution
To test the production build locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Trigger Production Compilation**:
   This runs Vite static builds and esbuild backend bundling:
   ```bash
   npm run build
   ```

3. **Start Standalone Node Server**:
   ```bash
   npm run start
   ```
   *Your full-stack container is now active and listening on the configured Port.*

---

## 3. Step-by-Step Cloud Deployments

### Option A: Google Cloud Run (Recommended)
Google Cloud Run is highly optimized for lightweight full-stack Node container services:

1. **Ensure Dockerfile is present** (or Cloud Run will automatically build via Google Cloud Buildpacks using the `start` script in `package.json`).
2. Run the deployment command via the Google Cloud CLI:
   ```bash
   gcloud run deploy aura-pixel-platform \
     --source . \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars ADMIN_EMAIL="aurapixeltech@gmail.com",ADMIN_PASSWORD="YOUR_SECURE_PASSWORD"
   ```

### Option B: Render or Fly.io
1. Connect your GitHub repository to **Render** or **Fly.io**.
2. Select **Web Service** (Render) or **App** (Fly.io).
3. Set the build environment settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
4. Define your environment variables (`ADMIN_EMAIL` and `ADMIN_PASSWORD`) inside the environment settings dashboard.
5. Click **Deploy**.

---

## 4. Persistent Database Storage
Aura Pixel stores state in `/data/db.json`. 
- For zero-maintenance serverless platforms (like Google Cloud Run), the disk is ephemeral by default. If your container restarts, any adjustments made via the Admin Dashboard could be reset.
- **Recommendation**: Mount a persistent volume directory mapping to `/data` in your cloud container dashboard, or configure a persistent disk (e.g. Google Cloud Storage fuse, Render Persistent Disks, or Fly Volumes) to keep database changes completely durable.
