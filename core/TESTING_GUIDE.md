# Testing Guide - User CRUD API

## 🚦 Step-by-Step Testing

### 1. Setup Database

#### MySQL
```bash
# Login ke MySQL
mysql -u root -p

# Jalankan command:
CREATE DATABASE mile_app;
exit;
```

Atau jalankan file SQL:
```bash
mysql -u root -p < CREATE_DATABASE.sql
```

#### MongoDB
MongoDB akan otomatis membuat database saat first insert. Pastikan MongoDB running:
```bash
# Windows (dengan Herd atau service)
# Cek status: services.msc → MongoDB

# Atau cek dengan:
mongosh
> show dbs
> exit
```

### 2. Run Migrations

```bash
# MySQL - Push schema ke database
npm run db:push

# MongoDB - Run migration
npm run mongo:migrate:up
```

### 3. Start Server

```bash
npm run start:dev
```

Pastikan muncul log:
```
✅ MySQL connected successfully
✅ MongoDB connected successfully
Server (development) running on port http://localhost:8080
```

### 4. Test API dengan cURL atau Postman

#### A. MySQL Endpoints

**Create User (MySQL)**
```bash
curl -X POST http://localhost:8080/api/users/mysql \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

**Get All Users (MySQL)**
```bash
curl http://localhost:8080/api/users/mysql
```

**Get User by ID (MySQL)**
```bash
curl http://localhost:8080/api/users/mysql/1
```

**Update User (MySQL)**
```bash
curl -X PUT http://localhost:8080/api/users/mysql/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Updated\"}"
```

**Delete User (MySQL)**
```bash
curl -X DELETE http://localhost:8080/api/users/mysql/1
```

#### B. MongoDB Endpoints

**Create User (MongoDB)**
```bash
curl -X POST http://localhost:8080/api/users/mongodb \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"password\":\"password123\"}"
```

**Get All Users (MongoDB)**
```bash
curl http://localhost:8080/api/users/mongodb
```

**Get User by ID (MongoDB)**
```bash
# Gunakan ObjectId dari response sebelumnya
curl http://localhost:8080/api/users/mongodb/6789abcd1234567890abcdef
```

**Update User (MongoDB)**
```bash
curl -X PUT http://localhost:8080/api/users/mongodb/6789abcd1234567890abcdef \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Updated\"}"
```

**Delete User (MongoDB)**
```bash
curl -X DELETE http://localhost:8080/api/users/mongodb/6789abcd1234567890abcdef
```

### 5. Test via Swagger UI

Buka browser: `http://localhost:8080/docs`

Kamu akan lihat dokumentasi API lengkap dengan 2 sections:
- **Users - MySQL**: Endpoint untuk MySQL database
- **Users - MongoDB**: Endpoint untuk MongoDB database

### 6. Test via Drizzle Studio (MySQL)

```bash
npm run db:studio
```

Buka: `http://local.drizzle.studio`

Kamu bisa lihat dan edit data MySQL dengan GUI.

## 📝 Expected Responses

### Success Response (Create)
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "createdAt": "2025-10-24T15:00:00.000Z",
    "updatedAt": "2025-10-24T15:00:00.000Z"
  },
  "statusCode": 201
}
```

### Error Response (Validation)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ],
  "statusCode": 400
}
```

### Error Response (Duplicate Email)
```json
{
  "success": false,
  "message": "Email already exists",
  "data": null,
  "statusCode": 400
}
```

## 🧪 Test Scenarios

### 1. Create User
- ✅ Valid data → Success
- ❌ Missing fields → Validation error
- ❌ Invalid email format → Validation error
- ❌ Duplicate email → Error

### 2. Get Users
- ✅ Users exist → Return list
- ❌ No users → 404 Not Found

### 3. Get User by ID
- ✅ Valid ID → Return user
- ❌ Invalid ID → 404 Not Found

### 4. Update User
- ✅ Valid data → Success
- ❌ User not found → 404
- ❌ Duplicate email → Error

### 5. Delete User
- ✅ Valid ID → Success
- ❌ User not found → 404

## 🔍 Verify Data

### MySQL
```bash
mysql -u root -p mile_app
```

```sql
SELECT * FROM users;
```

### MongoDB
```bash
mongosh
```

```javascript
use mile_app
db.users.find().pretty()
```

## 🐛 Common Issues

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::8080
```
Solusi: Ganti PORT di `.env` atau stop process yang menggunakan port 8080

### MySQL Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
Solusi: Pastikan MySQL running

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solusi: Start MongoDB service

## ✅ Checklist Testing

- [ ] Database MySQL sudah dibuat
- [ ] MongoDB running
- [ ] Migration MySQL berhasil
- [ ] Migration MongoDB berhasil  
- [ ] Server berjalan tanpa error
- [ ] Create user MySQL berhasil
- [ ] Create user MongoDB berhasil
- [ ] Get all users berhasil
- [ ] Get user by ID berhasil
- [ ] Update user berhasil
- [ ] Delete user berhasil
- [ ] Duplicate email validation works
- [ ] Swagger UI accessible
- [ ] Drizzle Studio accessible
