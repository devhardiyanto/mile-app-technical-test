# Database Migration Setup

This project uses **Drizzle ORM** for MySQL and **Mongoose** for MongoDB.

## 📋 Prerequisites

- MySQL running on `localhost:3306`
- MongoDB running on `localhost:27017`
- Node.js installed

## 🚀 Quick Start

### 1. Install Dependencies

Dependencies sudah terinstall. Jika belum, jalankan:

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` ke `.env` dan sesuaikan konfigurasi database:

```env
# MySQL Configuration
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_DATABASE="mile_app"

# MongoDB Configuration
MONGODB_URI="mongodb://localhost:27017/mile_app"
```

### 3. Create Database (MySQL)

Buat database MySQL terlebih dahulu:

```sql
CREATE DATABASE mile_app;
```

### 4. Run Migrations

#### MySQL (Drizzle)

```bash
# Generate migration files (sudah dilakukan)
npm run db:generate

# Apply migration ke database
npm run db:migrate

# Atau push schema langsung (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

#### MongoDB (Mongoose)

```bash
# Run migration UP
npm run mongo:migrate:up

# Rollback migration
npm run mongo:migrate:down
```

### 5. Start Server

```bash
npm run start:dev
```

Server akan jalan di `http://localhost:8080`

## 📚 API Endpoints

### MySQL Endpoints

- **GET** `/api/users/mysql` - Get all users
- **GET** `/api/users/mysql/:id` - Get user by ID
- **POST** `/api/users/mysql` - Create new user
- **PUT** `/api/users/mysql/:id` - Update user
- **DELETE** `/api/users/mysql/:id` - Delete user

### MongoDB Endpoints

- **GET** `/api/users/mongodb` - Get all users
- **GET** `/api/users/mongodb/:id` - Get user by ID (ObjectId)
- **POST** `/api/users/mongodb` - Create new user
- **PUT** `/api/users/mongodb/:id` - Update user
- **DELETE** `/api/users/mongodb/:id` - Delete user

### Request Body Example

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

## 📖 API Documentation

Swagger UI tersedia di: `http://localhost:8080/docs`

## 🗂️ Project Structure

```
src/
├── api/
│   └── user/
│       ├── user.model.ts              # Zod validation schemas
│       ├── user.controller.ts         # Request handlers
│       ├── user.service.ts            # Business logic
│       ├── user.repository.mysql.ts   # MySQL data layer
│       ├── user.repository.mongodb.ts # MongoDB data layer
│       └── user.router.ts             # Route definitions
├── database/
│   ├── mysql/
│   │   ├── schema/
│   │   │   ├── users.schema.ts        # Drizzle schema
│   │   │   └── index.ts
│   │   ├── migrations/                # Auto-generated SQL files
│   │   └── connection.ts              # MySQL connection
│   └── mongodb/
│       ├── models/
│       │   ├── user.model.ts          # Mongoose schema
│       │   └── index.ts
│       ├── migrations/                # Manual migrations
│       │   ├── 001-create-users-collection.ts
│       │   └── runner.ts
│       └── connection.ts              # MongoDB connection
└── index.ts                           # App entry point
```

## 🛠️ Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload

# Database - MySQL (Drizzle)
npm run db:generate        # Generate migration from schema
npm run db:migrate         # Run migrations
npm run db:push            # Push schema directly (dev only)
npm run db:studio          # Open Drizzle Studio GUI

# Database - MongoDB (Mongoose)
npm run mongo:migrate:up   # Run migrations
npm run mongo:migrate:down # Rollback migrations

# Testing
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode

# Build
npm run build              # Build for production
npm run start:prod         # Start production server
```

## 🔍 Drizzle Kit Commands

```bash
# Generate new migration after schema changes
npm run db:generate

# Apply pending migrations
npm run db:migrate

# Push schema directly (skip migrations - dev only)
npm run db:push

# Open Drizzle Studio on http://local.drizzle.studio
npm run db:studio
```

## 📝 Notes

### Drizzle ORM (MySQL)

- **Schema-first approach**: Define schema di `src/database/mysql/schema/`
- **Type-safe**: Full TypeScript support dengan type inference
- **Migrations**: Auto-generated SQL migration files
- **Drizzle Studio**: Built-in database GUI

### Mongoose (MongoDB)

- **Model-based**: Define models dengan Mongoose schema
- **Validation**: Built-in data validation
- **Middleware**: Pre/post hooks support
- **Manual migrations**: Custom migration scripts

### Migration Workflow

1. **MySQL**: Update schema → Generate migration → Apply migration
2. **MongoDB**: Create migration file → Run migration

## 🔒 Security Notes

- **Passwords**: Currently stored in plain text - implement hashing (bcrypt) untuk production
- **Validation**: Input validation menggunakan Zod
- **Environment**: Jangan commit `.env` file

## 🐛 Troubleshooting

### MySQL Connection Error

```bash
Error: ER_ACCESS_DENIED_ERROR
```

Solusi: Cek username/password di `.env`

### MongoDB Connection Error

```bash
Error: MongoServerError: Authentication failed
```

Solusi: Pastikan MongoDB running dan URI benar

### Migration Error

```bash
Error: Table already exists
```

Solusi: Drop table atau rollback migration terlebih dahulu
