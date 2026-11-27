# Kavach Vaani – Deployment Guide

---

## 1. Production Container Deployment
The application is pre-configured with a multi-stage Docker build:

```bash
# 1. Clone repository
git clone https://github.com/DEEKSHITH439/kavach-vaani.git
cd kavach-vaani

# 2. Start container stack
docker compose up --build -d

# 3. Access in browser
http://localhost:3000
```

---

## 2. Local Node.js Development
```bash
npm install
npm run build
npm run preview -- --port 3000
```

---

## 3. Production Deployment Prerequisites
1. **HTTPS Requirement:** Web Speech API (`SpeechRecognition`) strictly requires a secure context (`https://` or `http://localhost`) in modern Chromium and mobile browsers.
2. **Nginx Reverse Proxy:** If deploying to a cloud VM (e.g. AWS EC2, GCP Compute Engine, Azure), terminate SSL at Nginx / Caddy with a valid Let's Encrypt certificate.
3. **Static CDN Hosting:** The output of `npm run build` in `dist/` can also be hosted on any static edge CDN (Cloudflare Pages, Vercel, Netlify, or AWS S3 + CloudFront).
