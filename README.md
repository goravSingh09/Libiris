# 📚 Libris — The Digital Public Library (Full-Stack Edition)

> **"Your Library, Anywhere. Millions of Pages. One Library."**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

Libris is a full-stack digital public library platform built to democratize access to world literature, foundational science, computing textbooks, and competitive exam preparation.

---

## 🏗️ Architecture & Monorepo Structure

```text
webbuild/
├── frontend/                   # React 18, Vite, Tailwind CSS SPA
│   ├── src/
│   │   ├── components/         # Hero, Reader, Catalogue, Dashboard, Modals
│   │   ├── context/            # LibraryContext with backend API synchronization
│   │   ├── services/           # api.ts (REST client with JWT Authorization headers)
│   │   └── types/              # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── backend/                    # Express + TypeScript REST API Server
│   ├── src/
│   │   ├── config/             # MongoDB Atlas connection & MemoryStore fallback
│   │   ├── models/             # Mongoose schemas (User, Book, Category, UserLibrary, Purchase)
│   │   ├── middleware/         # JWT Auth & Admin RBAC verification
│   │   ├── routes/             # auth, books, categories, library, purchases, admin
│   │   ├── seed/               # seed.ts (32 curated books, 12 disciplines, demo users)
│   │   └── index.ts            # Main server entry with Helmet, CORS, and error handlers
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── tsconfig.json
└── package.json                # Monorepo scripts (concurrent execution)
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 2. Install Dependencies
Run from the root repository directory:
```bash
npm run install:all
```
*(Or `cd frontend && npm install` and `cd ../backend && npm install`)*.

### 3. Configure Environment Variables
Inside `backend/`, copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```
Populate `.env` with your values:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/libris?retryWrites=true&w=majority
JWT_SECRET=your_jwt_super_secret_key_change_in_production
CLIENT_URL=http://localhost:5173
```
> **Note on Database**: If `DATABASE_URL` is left blank during initial local testing, the backend will automatically initialize its built-in in-memory fallback store so all routes, demo logins, and catalog searches work immediately without errors.

### 4. Seed the Database
To populate MongoDB with the 32 curated volumes and 12 disciplines:
```bash
npm run seed
```

### 5. Start Frontend and Backend Concurrently
From the root directory:
```bash
npm run dev
```
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials (Judges & Evaluators)

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Reader (Patron)** | `reader@libris.library` | `reader123` | Full reader, bookmarks, library sync |
| **Administrator** | `admin@libris.library` | `admin123` | Ingest books, live price edits, analytics |

*(You can also register any new account using the Sign Up form).*

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (bcrypt password hashing) | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile & streaks | **Yes (Bearer JWT)** |
| `POST` | `/api/auth/logout` | Terminate session | No |

### Books Catalogue (`/api/books`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Search (`?q=`), filter (`?category=`, `?price=`), sort, and paginate | No |
| `GET` | `/api/books/:id` | Fetch single book with full chapters & reviews | No |
| `POST` | `/api/books` | Ingest new book record | **Admin Only** |
| `PUT` | `/api/books/:id` | Update book details / adjust pricing | **Admin Only** |
| `DELETE` | `/api/books/:id` | Remove book from catalogue | **Admin Only** |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all 12 discipline taxonomies | No |

### User Library & Reading Sync (`/api/library`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/library` | Fetch user's reading list, progress, and bookmarks | **Yes** |
| `POST` | `/api/library/save/:bookId` | Toggle save/wishlist for a book | **Yes** |
| `POST` | `/api/library/progress` | Sync active page, chapter, and % complete | **Yes** |
| `POST` | `/api/library/bookmark` | Add or remove page bookmark with note | **Yes** |

### Purchases & Micro-Access (`/api/purchases`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/purchases/checkout` | Unlock book (Free or ₹5–₹20 Micro-Pass) | **Yes** |
| `GET` | `/api/purchases/my` | View user order history & transactions | **Yes** |

### Admin Dashboard Metrics (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/metrics` | Platform totals, reads, micro-revenue, uptime | **Admin Only** |
| `GET` | `/api/admin/users` | List registered accounts | **Admin Only** |
| `GET` | `/api/admin/purchases`| Audit all purchase transactions | **Admin Only** |

---

## 🌐 Free-Tier Production Deployment Guide

### 1. Database: MongoDB Atlas (Free M0 Cluster)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (**M0 Free Tier**).
3. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere).
4. Under **Database Access**, create a database user with username and password.
5. Click **Connect** > **Drivers** > copy the connection string:
   `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/libris?retryWrites=true&w=majority`

### 2. Backend: Render / Railway / Koyeb (Free Tier)
1. Create a new **Web Service** pointing to your GitHub repository: `https://github.com/goravSingh09/Libiris`.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install && npm run build`.
4. Set **Start Command**: `npm start`.
5. Add Environment Variables:
   - `DATABASE_URL` = *(Your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(A secure random string)*
   - `CLIENT_URL` = *(Your Vercel frontend URL, e.g. https://libris.vercel.app)*
   - `PORT` = `5000`

### 3. Frontend: Vercel (Free Tier)
1. Go to [vercel.com](https://vercel.com) and import `goravSingh09/Libiris`.
2. In Project Settings, set **Root Directory** to `frontend`.
3. Set Environment Variable:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
4. Click **Deploy**. Vercel will build and serve the application globally with automatic SSL.

---

## 📜 Ethical Compliance & Open Access

All featured literature consists of verified public-domain literary canon or openly licensed educational frameworks. Commercial payment gateways are isolated from test/demo simulation to ensure no unauthorized micro-charges are initiated during competition judging.

---

## 📄 License
Licensed under the [MIT License](LICENSE).
