# 🎯 Real-Time AI Quiz Platform

A full-stack, multiplayer educational application that dynamically generates quizzes using Artificial Intelligence and synchronizes live results across all connected players using WebSockets. 

![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Now-2ecc71?style=for-the-badge) ## ✨ Features

* **🤖 AI-Powered Quiz Generation:** Generates unique, topic-based quizzes on the fly using the Groq Llama 3 model.
* **⚡ Real-Time Multiplayer:** Uses Socket.io to instantly broadcast scores and update a live leaderboard across all connected browsers.
* **⏱️ Auto-Submitting Timer:** Custom React hooks manage a strict countdown timer that automatically grades and submits the quiz when time expires.
* **📄 PDF Report Cards:** Generates downloadable, styled PDF breakdown of correct and incorrect answers on the client side using `html2pdf.js`.
* **☁️ Cloud-Native Architecture:** Fully deployed across Vercel (Edge Network), Render (Node.js Server), and Neon.tech (Serverless Postgres).

## 🛠️ Tech Stack

**Frontend**
* React.js (Vite)
* Socket.io-client (Real-time events)
* Axios (HTTP requests)
* html2pdf.js (Client-side PDF generation)

**Backend**
* Node.js & Express
* Socket.io (WebSocket server)
* Groq SDK (LLM integration)
* `pg` (PostgreSQL client)

**Infrastructure**
* Database: Neon.tech (PostgreSQL)
* Backend Hosting: Render
* Frontend Hosting: Vercel

## 🚀 Local Setup & Installation

If you want to run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/Udit2906/Real-Time-AI-Quiz-Platform.git](https://github.com/Udit2906/Real-Time-AI-Quiz-Platform.git)
cd Real-Time-AI-Quiz-Platform
