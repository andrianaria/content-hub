This project is a fullstack web application built with **Next.js (App Router, TypeScript)**, styled with **TailwindCSS + shadcn/ui**, and powered by **PostgreSQL (Neon)** via **Prisma/Neon serverless driver**.  
It implements authentication with **NextAuth (Auth.js)** using Google and Facebook OAuth providers, plus JWT-based sessions.

---

## 🚀 Features
- **Authentication**
  - Sign in with **Google** or **Facebook**
  - Credentials provider (manual login) – optional
  - JWT-based sessions with secure secrets
- **Content Display**
  - Articles (list + detail view)
  - Videos (list + embedded player)
- **Membership Plans**
  - Plan A: max 5 articles & 5 videos / month
  - Plan B: max 10 articles & 10 videos / month
  - Plan C: unlimited content
- **Database**
  - PostgreSQL (via Neon)
  - Tables for Users, Memberships, Content, Access logs

---

## 🛠 Tech Stack
- **Frontend**: Next.js 14+, React, TypeScript  
- **Styling**: TailwindCSS + shadcn/ui components  
- **Auth**: NextAuth (Auth.js)  
- **Database**: PostgreSQL (Neon serverless)  
- **ORM**: Prisma or SQL with `@neondatabase/serverless`  
- **Deployment**: Vercel  

---

## 📦 Installation & Setup

### 1. Clone the repo
```bash
git clone https://github.com/andrianaria/content-hub.git
cd content-hub
