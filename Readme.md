# 🚆 IRCTC-like Railway Booking API

A simple Node.js + Express backend for a railway booking system with authentication, train management, and seat booking.

---

## 🔧 Tech Stack

```
- Node.js + Express  
- MySQL 
- JWT Authentication  
- API Key Middleware  
```

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nehakumari1208/workindia
cd workindia
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root:

```env
PORT=5000

# MySQL Database Config
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=irctc_db

# Secrets
JWT_SECRET=your_jwt_secret
ADMIN_API_KEY=your_admin_api_key
```

### 4. Run the Server

```bash
npm run dev
```

Server will start at: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Auth Routes

### ➕ POST `/auth/register`

Register a new user  
**Body:**

```json
{
  "name": "Amit",
  "email": "amit@example.com",
  "password": "secure123",
  "role": "user"
}
```

### 🔑 POST `/auth/login`

Login user and get JWT token  
**Body:**

```json
{
  "email": "amit@example.com",
  "password": "secure123"
}
```

---

## 🎫 Booking Routes (Require JWT)

> Add this header to all booking requests:  
> `Authorization: Bearer <JWT_TOKEN>`

### 🛒 POST `/bookings/`

Create a booking  
**Body:**

```json
{
  "train_id": 1,
  "seat_number": 5,
  "source": "Delhi",
  "destination": "Mumbai"
}
```

### 📍 GET `/bookings/availability/route?source=Delhi&destination=Mumbai`

Get all trains on a route with seat availability

### 📄 GET `/bookings/:id`

Get booking details by ID

---

## 🚆 Train Routes (Require API Key)

> Add this header to all train requests:  
> `x-api-key: your_admin_api_key`

### ➕ POST `/trains/`

Create a new train  
**Body:**

```json
{
  "name": "Rajdhani Express",
  "source": "Delhi",
  "destination": "Mumbai",
  "total_seats": 120
}
```
