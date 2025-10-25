# 🚀 MileApp Task Management API

[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?logo=laravel)](https://laravel.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.2-47A248?logo=mongodb)](https://www.mongodb.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php)](https://www.php.net)
[![Scramble](https://img.shields.io/badge/Scramble-API%20Docs-0EA5E9)](https://scramble.dedoc.co)
[![Tests](https://img.shields.io/badge/Tests-Pest-FF2D20)](https://pestphp.com)

A production-ready RESTful API for Task Management built with **Laravel 12**, **MongoDB**, and **Scramble API Documentation**. Features include mock authentication, full CRUD operations, pagination, filtering, sorting, search, and comprehensive unit testing.

## ✨ Features

### Core Functionality
- ✅ **Mock Authentication** - Token-based auth with base64 encoding
- ✅ **Task CRUD** - Complete Create, Read, Update, Delete operations
- ✅ **Pagination** - Efficient data loading with configurable page size
- ✅ **Filtering** - By status (pending/completed) and priority (low/medium/high)
- ✅ **Sorting** - By created_at, updated_at, title, priority, status (asc/desc)
- ✅ **Search** - Full-text search across title and description

### Architecture & Design
- ✅ **DTOs (Data Transfer Objects)** - Clean data handling and validation
- ✅ **Form Requests** - Laravel validation with custom messages
- ✅ **MongoDB Integration** - NoSQL database with optimized indexes
- ✅ **API Documentation** - Auto-generated with Scramble
- ✅ **Unit Tests** - Comprehensive test coverage with Pest PHP
- ✅ **RESTful Design** - Proper HTTP methods and status codes

## 🎯 Project Structure

```
core-laravel/
├── app/
│   ├── DTOs/                      # Data Transfer Objects
│   │   ├── LoginDTO.php          # Login data structure
│   │   ├── TaskDTO.php           # Task data structure
│   │   └── TaskFilterDTO.php     # Filter parameters
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php    # Mock authentication
│   │   │   └── TaskController.php    # Task CRUD + pagination/filter/sort
│   │   └── Requests/
│   │       ├── LoginRequest.php      # Login validation
│   │       ├── StoreTaskRequest.php  # Create task validation
│   │       └── UpdateTaskRequest.php # Update task validation
│   └── Models/
│       └── Task.php              # MongoDB Eloquent Model
├── config/
│   ├── database.php              # MongoDB connection config
│   └── scramble.php              # API docs configuration
├── database/
│   └── indexes.js                # MongoDB indexes script
├── routes/
│   └── api.php                   # API routes
├── tests/Feature/
│   ├── AuthControllerTest.php    # Auth endpoint tests
│   └── TaskControllerTest.php    # Task endpoint tests (20+ scenarios)
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- PHP >= 8.2
- Composer
- MongoDB (local or Atlas)
- MongoDB PHP Extension

### Installation

```bash
# 1. Clone repository
cd core-laravel

# 2. Install dependencies
composer install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Configure MongoDB in .env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=mile_app

# 5. Create MongoDB indexes (optional but recommended)
mongosh mile_app database/indexes.js

# 6. Run tests
php artisan test

# 7. Start development server
php artisan serve
```

### Access

- **API Base**: `http://localhost:8000/api`
- **API Documentation**: `http://localhost:8000/docs/api`
- **Health Check**: `http://localhost:8000/up`

## 📖 API Documentation

### Authentication

#### **POST** `/api/auth/login`

Mock login endpoint that accepts any email/password (min 6 chars).

**Request:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "dGVzdEBleGFtcGxlLmNvbToxNzQwNDI...",
    "user": {
      "id": "user_098f6bcd4621d373cade4e832627b4f6",
      "email": "test@example.com",
      "name": "Test"
    }
  }
}
```

### Tasks

#### **GET** `/api/tasks`

Retrieve paginated tasks with optional filtering and sorting.

**Query Parameters:**
- `page` (int) - Page number (default: 1)
- `limit` (int) - Items per page (default: 10)
- `status` (string) - Filter by status: `pending`, `completed`
- `priority` (string) - Filter by priority: `low`, `medium`, `high`
- `search` (string) - Search in title and description
- `sortBy` (string) - Sort field: `created_at`, `updated_at`, `title`, `priority`, `status`
- `sortOrder` (string) - Sort direction: `asc`, `desc`

**Example:**
```bash
GET /api/tasks?page=1&limit=10&status=pending&priority=high&sortBy=created_at&sortOrder=desc
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete Laravel project",
      "description": "Implement all CRUD operations",
      "priority": "high",
      "status": "pending",
      "user_id": "user_mock_123",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "last_page": 5,
    "from": 1,
    "to": 10
  }
}
```

#### **GET** `/api/tasks/{id}`

Retrieve a specific task.

**Response (200):**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": { ...task object... }
}
```

#### **POST** `/api/tasks`

Create a new task.

**Request:**
```json
{
  "title": "New Task",
  "description": "Task description (optional)",
  "priority": "medium",
  "status": "pending"
}
```

**Validation Rules:**
- `title` - required, max:200
- `description` - optional, max:1000
- `priority` - required, in:low,medium,high
- `status` - required, in:pending,completed

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ...created task... }
}
```

#### **PUT** `/api/tasks/{id}`

Update an existing task.

**Request:** (all fields optional)
```json
{
  "title": "Updated title",
  "priority": "high",
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": { ...updated task... }
}
```

#### **DELETE** `/api/tasks/{id}`

Delete a task.

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## 🗂️ MongoDB Indexes

### Index Strategy

The API uses **6 optimized indexes** for performance:

1. **`idx_userId_createdAt`** - Default listing sorted by date
2. **`idx_userId_status`** - Filter by status
3. **`idx_userId_priority`** - Filter by priority  
4. **`idx_userId_status_createdAt`** - Combined filter + sort
5. **`idx_text_search`** - Full-text search (weighted: title 3x, description 1x)
6. **`idx_userId_updatedAt`** - Sort by last update

### Why These Indexes?

**Multi-Tenant Pattern:**
- All queries are scoped by `user_id` (first field in compound indexes)
- Ensures data isolation and optimal query performance

**Common Query Patterns:**
- List all tasks sorted by date → `idx_userId_createdAt`
- Filter pending tasks → `idx_userId_status`  
- Filter high priority → `idx_userId_priority`
- Pending tasks newest first → `idx_userId_status_createdAt`
- Search "urgent" → `idx_text_search`

**Background Creation:**
- All indexes use `background: true` to avoid blocking writes
- Safe for production deployment

### Create Indexes

```bash
# Via mongosh
mongosh mile_app database/indexes.js

# Or via MongoDB Compass
# Load and execute database/indexes.js
```

## 🧪 Testing

### Run All Tests

```bash
php artisan test
```

### Test Coverage

**AuthController Tests** (7 scenarios):
- ✅ Successful login with valid credentials
- ✅ Invalid email format rejection
- ✅ Missing email/password validation
- ✅ Short password validation (< 6 chars)
- ✅ Token format verification
- ✅ User name generation from email

**TaskController Tests** (20+ scenarios):
- ✅ Get tasks with pagination
- ✅ Filter by status (pending/completed)
- ✅ Filter by priority (low/medium/high)
- ✅ Search by title/description
- ✅ Sort by multiple fields (asc/desc)
- ✅ Get single task by ID
- ✅ Create task with valid data
- ✅ Create task validation (missing fields, invalid values)
- ✅ Update task (partial updates supported)
- ✅ Delete task
- ✅ 404 handling for non-existent tasks
- ✅ Field length validations (title: 200, description: 1000)

### Run Specific Tests

```bash
# Auth tests only
php artisan test --filter=AuthControllerTest

# Task tests only
php artisan test --filter=TaskControllerTest

# Specific test method
php artisan test --filter=test_can_create_task_with_valid_data
```

## 🏗️ Architecture Decisions

### Why DTOs?

**Benefits:**
- **Type Safety** - PHP 8.2 readonly properties
- **Immutability** - Data cannot be modified after creation
- **Clear Contracts** - Explicit data structures
- **Testability** - Easy to mock and test

**Example:**
```php
public function store(StoreTaskRequest $request)
{
    $taskDTO = TaskDTO::fromRequest($request->validated(), $userId);
    $task = Task::create($taskDTO->toArray());
    // ...
}
```

### Why MongoDB?

**Advantages:**
- **Schema Flexibility** - Easy to add new fields
- **JSON-native** - Perfect for API responses
- **Horizontal Scaling** - Sharding support
- **Rich Queries** - Text search, aggregations
- **Fast Writes** - No joins, denormalized data

**Laravel MongoDB Integration:**
```php
use MongoDB\Laravel\Eloquent\Model;

class Task extends Model {
    protected $connection = 'mongodb';
    // Use familiar Eloquent syntax!
}
```

### Why Scramble?

**Auto-Generated Docs:**
- No manual OpenAPI spec writing
- Reads PHPDoc annotations
- Interactive Stoplight UI
- Always in sync with code

**Example:**
```php
/**
 * @tags Tasks
 * @response 200 {"success": true, "data": [...]}
 */
public function index() { }
```

### Why Pest PHP?

**Modern Testing:**
- Cleaner syntax than PHPUnit
- Better error messages
- Built-in expectations
- Laravel-first approach

```php
test('can create task', function () {
    $response = $this->postJson('/api/tasks', [...]);
    $response->assertStatus(201);
});
```

## 🔒 Security Considerations

### Current Implementation (Mock)

⚠️ **This is a mock authentication system for demonstration purposes**

**What's Implemented:**
- Base64 token generation
- User ID based on email hash
- No password verification

**For Production:**

```php
// TODO: Replace with:
- JWT tokens (tymon/jwt-auth)
- Password hashing (Hash::make())
- Token refresh mechanism  
- Rate limiting (middleware)
- CORS configuration
- API key authentication
```

### Input Validation

✅ **All inputs are validated:**
- Laravel Form Requests
- Custom validation rules
- Type-safe DTOs
- MongoDB schema validation

## 📊 Performance Optimization

### Database
- ✅ 6 optimized MongoDB indexes
- ✅ Compound indexes for common queries
- ✅ Text index for fast search
- ✅ Background index creation

### API
- ✅ Pagination (prevent large data transfers)
- ✅ Selective field projection
- ✅ Query result caching (can be added)

### Monitoring

```bash
# Check index usage
mongosh mile_app --eval "db.tasks.aggregate([{\$indexStats: {}}])"

# Query performance
mongosh mile_app --eval "db.tasks.find({user_id: 'test'}).explain('executionStats')"
```

## 🚀 Deployment

### Environment Variables

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
MONGODB_DATABASE=mile_app
```

### Deployment Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Use MongoDB Atlas (cloud)
- [ ] Create production indexes
- [ ] Enable CORS for frontend domain
- [ ] Setup SSL/TLS
- [ ] Configure rate limiting
- [ ] Setup monitoring (New Relic, Sentry)
- [ ] Run `composer install --no-dev`
- [ ] Run `php artisan optimize`

### Recommended Platforms

- **Laravel Vapor** (AWS Lambda) - Serverless Laravel
- **Laravel Forge** (VPS) - Server management
- **DigitalOcean App Platform** - Simple deployment
- **Heroku** - Quick deployment

## 📝 Development Notes

### Code Style

```bash
# Format code
./vendor/bin/pint

# Check style
./vendor/bin/pint --test
```

### Adding New Features

1. Create DTO (if needed)
2. Create Form Request for validation
3. Add controller method with PHPDoc
4. Register route in `routes/api.php`
5. Write tests in `tests/Feature/`
6. Run tests: `php artisan test`

## 🤝 Contributing

This is a technical test project. For production use:

1. Implement real JWT authentication
2. Add user registration endpoint
3. Add role-based permissions
4. Implement rate limiting
5. Add request/response logging
6. Setup CI/CD pipeline

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [MongoDB Laravel](https://github.com/mongodb/laravel-mongodb)
- [Scramble Docs](https://scramble.dedoc.co)
- [Pest PHP](https://pestphp.com)

## 📄 License

MIT License - Built for MileApp Technical Test

---

**Built with ❤️ using Laravel 12, MongoDB, and Scramble**

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
