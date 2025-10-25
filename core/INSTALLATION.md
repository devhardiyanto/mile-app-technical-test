# 📦 Installation Guide - MileApp Laravel API

## Prerequisites

### Required Software
- **PHP** >= 8.2 with extensions:
  - mongodb
  - curl
  - mbstring
  - openssl
  - pdo
  - tokenizer
  - xml
  - zip
- **Composer** >= 2.0
- **MongoDB** >= 5.0 (local or Atlas)

### Check PHP Version & Extensions

```bash
# Check PHP version
php -v

# Check MongoDB extension
php -m | grep mongodb

# If mongodb extension is missing:
# Ubuntu/Debian:
sudo pecl install mongodb
# Add to php.ini: extension=mongodb.so

# macOS (Homebrew):
pecl install mongodb

# Windows:
# Download php_mongodb.dll and add to php.ini
```

---

## Step-by-Step Installation

### 1. Navigate to Project Directory

```bash
cd core-laravel
```

### 2. Install PHP Dependencies

```bash
composer install
```

**Expected output:**
```
Installing dependencies from lock file
Package operations: 135 installs, 0 updates, 0 removals
  - Installing dedoc/scramble (v0.11.x)
  - Installing mongodb/laravel-mongodb (v5.2.x)
  ...
Generating optimized autoload files
```

### 3. Setup Environment

```bash
# Copy example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure MongoDB

Edit `.env` file:

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=mile_app

# For MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DATABASE=mile_app
```

### 5. Install MongoDB (if not installed)

#### **Option A: Local MongoDB**

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run installer
- Start MongoDB service from Services

#### **Option B: MongoDB Atlas (Free Tier)**

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Setup database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

### 6. Create MongoDB Indexes (Recommended)

```bash
# Connect to MongoDB and run indexes script
mongosh mile_app database/indexes.js
```

**Or manually:**
```bash
mongosh
> use mile_app
> load('database/indexes.js')
```

### 7. Verify Installation

```bash
# Run tests to verify everything works
php artisan test
```

**Expected output:**
```
  PASS  Tests\Feature\AuthControllerTest
  ✓ login successful with valid credentials
  ✓ login fails with invalid email
  ✓ login fails with missing email
  ✓ login fails with missing password
  ✓ login fails with short password
  ✓ login token is base64 encoded
  ✓ user name generated from email

  PASS  Tests\Feature\TaskControllerTest
  ✓ can get all tasks with pagination
  ✓ can filter tasks by status
  ✓ can filter tasks by priority
  ... (20+ tests)

Tests:  27 passed
Time:   X.XXs
```

### 8. Start Development Server

```bash
php artisan serve
```

**Server will start at:** `http://localhost:8000`

---

## Verify Everything Works

### Test API Endpoints

```bash
# Test health check
curl http://localhost:8000/up

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Test get tasks
curl http://localhost:8000/api/tasks
```

### Access API Documentation

Open browser: **http://localhost:8000/docs/api**

You should see Scramble interactive API documentation.

---

## Troubleshooting

### Issue: "mongodb extension not found"

**Solution:**
```bash
# Install extension
pecl install mongodb

# Add to php.ini
echo "extension=mongodb.so" | sudo tee -a /etc/php/8.2/cli/php.ini
echo "extension=mongodb.so" | sudo tee -a /etc/php/8.2/fpm/php.ini

# Restart PHP
sudo systemctl restart php8.2-fpm
```

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod   # Linux
brew services list             # macOS

# Test connection
mongosh

# If Atlas, check:
# - Connection string is correct
# - IP whitelist includes your IP
# - Username/password is correct
```

### Issue: "Class 'MongoDB\Laravel\Eloquent\Model' not found"

**Solution:**
```bash
# Reinstall dependencies
rm -rf vendor composer.lock
composer install
```

### Issue: "Tests fail with database errors"

**Solution:**
```bash
# Ensure MongoDB is running
sudo systemctl start mongod

# Clear config cache
php artisan config:clear

# Re-run tests
php artisan test
```

---

## Optional: Code Formatting

```bash
# Install Laravel Pint (if not installed)
composer require laravel/pint --dev

# Format code
./vendor/bin/pint

# Check code style
./vendor/bin/pint --test
```

---

## Next Steps

1. ✅ Installation complete
2. 📖 Read [README.md](README.md) for API documentation
3. 🧪 Run tests: `php artisan test`
4. 🚀 Start coding!

---

**Need help?** Check:
- [Laravel Docs](https://laravel.com/docs)
- [MongoDB Laravel](https://github.com/mongodb/laravel-mongodb)
- [Scramble Docs](https://scramble.dedoc.co)
