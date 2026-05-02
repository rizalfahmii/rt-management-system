cat << 'EOF' > README.md
# 🏘️ RT Management System

Sistem manajemen administrasi RT berbasis web untuk mengelola penghuni, rumah, pembayaran iuran, pengeluaran, dan laporan keuangan secara terpusat dan real-time.


## ⚙️ Tech Stack

### Backend
- Laravel 12 (REST API)
- MySQL
- Laravel Sanctum (Authentication)

### Frontend
- React (Vite)
- TailwindCSS
- Axios
- Recharts (Data Visualization)

## 🚀 System Features

### 1. Resident Management
- CRUD data penghuni
- Upload KTP
- Status: tetap / kontrak
- Data kontak & status pernikahan

### 2. House Management
- CRUD rumah
- Assign / remove resident
- House status: dihuni / kosong
- Historical tracking penghuni

### 3. Payment Management
- Generate billing otomatis
- 2 types of fees:
  - Cleaning fee (Rp 15.000)
  - Security fee (Rp 100.000)
- Payment modes:
  - Monthly
  - Yearly (cleaning only)
- Payment status: paid / unpaid

### 4. Expense Management
- Operational RT expenses
- Categories: security, maintenance, cleaning
- Monthly tracking

### 5. Dashboard & Reporting
- Monthly income & expense summary
- Real-time balance calculation
- 12-month financial chart
- Recent transactions overview

### 6. Export Feature
- Export financial report to Excel
- Filter by month & year

## 🧠 Business Logic Summary

- Houses without residents are not billed
- Permanent residents are billed monthly
- Temporary residents are billed only when active
- Yearly payment applies only to cleaning fee
- Security fee is strictly monthly

## 🗄️ Database Overview

### Core Tables
- users (admin authentication)
- houses
- residents
- payments
- payment_types
- expenses

### Key Relations
- house → residents (history tracked via payments)
- payments → payment_types
- payments → residents + houses

## 🔐 Authentication

System uses Laravel Sanctum token-based authentication.

## 📦 Installation Guide

### 1. Clone Repository
- git clone https://github.com/rizalfahmii/rt-management-system
- cd rt-backend

### 2. Install Dependencies
composer install

### 3. Environment Setup
- cp .env.example .env
- php artisan key:generate

- DB Configuration:
DB_DATABASE=administrasi_rt
DB_USERNAME=root
DB_PASSWORD=
DB_PORT=3305

### 4. Database Setup
php artisan migrate:fresh --seed

Seeder includes:
- Admin user
- Houses (8 units)
- Residents sample data
- Payment types
- Dummy payments (12 months)
- Sample expenses

### 5. Run Backend
php artisan serve

Backend:
http://localhost:8000

### 6. Frontend Setup
- cd rt-frontend
- npm install
- npm run dev

Frontend:
http://localhost:5173

## 📡 API Base URL
http://localhost:8000/api

## 🔑 Default Login
Email    : adminrt@gmail.com  
Password : admin123  


## ⚠️ Important Notes
- No Docker usage
- Backend & frontend separated
- REST API architecture
- Laravel Sanctum authentication
- Seeder included


## 🚀 Quick Start
- composer install
- cp .env.example .env
- php artisan key:generate
- php artisan migrate:fresh --seed
- php artisan serve

- cd rt-frontend
- npm install
- npm run dev

## 🚀 Status
✔ Ready for demo  
✔ Fully seeded data  
✔ API integrated  
✔ Reporting active  

