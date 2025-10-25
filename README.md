# MileApp Technical Test - Task Management Application

A full-stack Task Management application built with Vue.js (frontend) and Express.js (backend) using MongoDB.

## 🎯 Features

### Authentication
- Mock login system with token-based authentication
- Protected routes with route guards
- Persistent session using Pinia with localStorage

### Task Management (CRUD)
- ✅ **Create** - Add new tasks with title, description, priority, and status
- ✅ **Read** - View all tasks with pagination, filtering, and sorting
- ✅ **Update** - Edit existing tasks
- ✅ **Delete** - Remove tasks with confirmation
- ✅ **Toggle Status** - Quick complete/uncomplete tasks

### Advanced Features
- **Pagination** - Navigate through tasks efficiently
- **Filtering** - Filter by status (pending/completed) and priority (low/medium/high)
- **Sorting** - Sort by date, title, priority, or status
- **Search** - Full-text search across title and description (MongoDB text index)
- **Real-time UI Updates** - Optimistic updates with Pinia state management

## 🏗️ Tech Stack

### Frontend (`/app`)
- **Framework**: Vue 3 with Composition API + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia with persistence plugin
- **Routing**: Vue Router with route guards
- **Styling**: TailwindCSS
- **UI Components**: Custom components built with Reka UI (shadcn-vue style)
- **Icons**: Lucide Vue
- **HTTP Client**: Axios with interceptors
- **Notifications**: Vue Sonner (toast)

### Backend (`/core`)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod schemas
- **API Documentation**: OpenAPI/Swagger
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Pino
- **Testing**: Vitest + Supertest

## 📁 Project Structure

```
mile-app-technical-test/
├── app/                          # Frontend Vue.js application
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/              # Reusable UI components
│   │   │       ├── button/
│   │   │       ├── card/
│   │   │       ├── dialog/      # Task creation/edit modal
│   │   │       ├── input/
│   │   │       ├── select/
│   │   │       └── ...
│   │   ├── layouts/             # Layout components
│   │   │   ├── auth.vue        # Layout for login page
│   │   │   └── default.vue     # Layout for authenticated pages
│   │   ├── router/              # Route definitions
│   │   │   ├── auth.ts         # Login routes
│   │   │   ├── tasks.ts        # Task routes
│   │   │   └── index.ts        # Main router with guards
│   │   ├── stores/              # Pinia stores
│   │   │   ├── auth.ts         # Authentication state
│   │   │   └── tasks.ts        # Tasks state & actions
│   │   ├── services/            # API service layer
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── types/               # TypeScript definitions
│   │   │   ├── auth.ts
│   │   │   ├── task.ts
│   │   │   └── api.ts
│   │   ├── views/               # Page components
│   │   │   ├── login/          # Login page
│   │   │   └── tasks/          # Tasks page with components
│   │   │       ├── components/
│   │   │       │   ├── TaskCard.vue
│   │   │       │   └── TaskDialog.vue
│   │   │       └── index.vue
│   │   └── lib/                # Utilities
│   │       └── client.ts       # Axios instance
│   └── package.json
│
├── core/                        # Backend Express.js API
│   ├── src/
│   │   ├── api/                # API modules
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── auth.router.ts
│   │   │   │   └── auth.service.ts
│   │   │   └── task/          # Task CRUD endpoints
│   │   │       ├── task.controller.ts
│   │   │       ├── task.model.ts       # Zod schemas
│   │   │       ├── task.repository.ts
│   │   │       ├── task.router.ts
│   │   │       └── task.service.ts
│   │   ├── database/
│   │   │   └── mongodb/
│   │   │       ├── connection.ts
│   │   │       └── models/
│   │   │           ├── task.model.ts   # Mongoose schema
│   │   │           └── user.model.ts
│   │   ├── common/            # Shared utilities
│   │   │   ├── middleware/
│   │   │   └── models/
│   │   ├── api-docs/          # OpenAPI documentation
│   │   ├── index.ts
│   │   └── server.ts
│   ├── db/
│   │   └── indexes.js         # MongoDB index creation script
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or cloud instance)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd mile-app-technical-test
```

#### 2. Backend Setup
```bash
cd core
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/mile_app
# PORT=3000
# CORS_ORIGIN=http://localhost:5173

# Run MongoDB index creation (optional but recommended)
node db/indexes.js

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3000`
- API docs available at `http://localhost:3000/docs`
- Swagger JSON at `http://localhost:3000/swagger.json`

#### 3. Frontend Setup
```bash
cd app
npm install

# Create .env file
# VITE_API_BASE_URL=http://localhost:3000/api

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Authentication

The application uses a **mock authentication** system for demonstration purposes:

- **Login**: Accept any email/password combination (min 6 characters)
- **Token**: Mock token generated using base64 encoding
- **Session**: Persisted in localStorage via Pinia plugin

### Example Credentials
```
Email: user@example.com
Password: password123
```

> **Note**: In production, implement proper JWT authentication with password hashing.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Mock login, returns token

### Tasks
- `GET /api/tasks` - Get all tasks (with pagination, filter, sort)
  - Query params: `page`, `limit`, `status`, `priority`, `sortBy`, `sortOrder`, `search`
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### API Response Format
```json
{
  "success": true,
  "message": "Task created successfully",
  "responseObject": { ... },
  "statusCode": 201
}
```

## 💾 Database Design

### Task Schema
```javascript
{
  title: String (required, max 200 chars),
  description: String (optional, max 1000 chars),
  priority: Enum ['low', 'medium', 'high'],
  status: Enum ['pending', 'completed'],
  userId: String (required, indexed),
  createdAt: Date,
  updatedAt: Date
}
```

### MongoDB Indexes

Indexes are optimized for common query patterns:

1. **`{ userId: 1, createdAt: -1 }`** - Default listing sorted by date
2. **`{ userId: 1, status: 1 }`** - Filter by status
3. **`{ userId: 1, priority: 1 }`** - Filter by priority
4. **`{ userId: 1, status: 1, createdAt: -1 }`** - Compound filter + sort
5. **`{ title: 'text', description: 'text' }`** - Full-text search
6. **`{ userId: 1, updatedAt: -1 }`** - Sort by last updated

**Why these indexes?**
- All queries are scoped to `userId` (multi-tenant design)
- Common filtering by `status` and `priority`
- Sorting by date is the default behavior
- Text index enables fast search without regex
- Background index creation prevents blocking

## 🎨 UI/UX Design

The UI follows a clean, minimalist design with:
- **Card-based layout** for tasks (inspired by the provided design)
- **Priority badges** with color coding
- **Quick actions** (edit, complete, delete) on each card
- **Modal dialogs** for create/edit operations
- **Responsive design** for mobile/tablet/desktop
- **Loading states** and **empty states**
- **Toast notifications** for user feedback

### Priority Colors
- 🔴 High - Red/Destructive
- 🟡 Medium - Neutral
- 🟢 Low - Secondary

## 🧪 Testing

### Backend
```bash
cd core
npm test              # Run tests
npm run test:watch    # Watch mode
```

### Frontend
```bash
cd app
npm run build         # Type check + build
```

## 📦 Deployment

### Backend (Recommended: Railway, Render, or Fly.io)
```bash
cd core
npm run build
npm run start:prod
```

### Frontend (Recommended: Vercel or Netlify)
```bash
cd app
npm run build
# Deploy the `dist` folder
```

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
CORS_ORIGIN=https://your-frontend-url.com
NODE_ENV=production
```

**Frontend (.env)**
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## 🗑️ Files to Remove (Cleanup)

For boilerplate cleanup, remove these unused files:
- `app/src/AppBak.vue` - Backup file
- `app/src/components/HelloWorld.vue` - Example component
- `app/src/router/home.ts` - Old router file
- `app/src/stores/task.ts` - Old store (replaced by tasks.ts)

## 🔧 Development Notes

### Code Quality
- TypeScript strict mode enabled
- Zod for runtime validation
- Error handling with try-catch
- Axios interceptors for global error handling
- Rate limiting on API

### Performance
- Lazy-loaded routes
- Optimized MongoDB queries with indexes
- Pagination to limit data transfer
- Background index creation

### Security Considerations
- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting
- Input validation (Zod schemas)
- **TODO**: Add JWT authentication in production
- **TODO**: Add password hashing (bcrypt)
- **TODO**: Add refresh tokens

## 📝 Design Decisions

### Why Pinia over Vuex?
- Official recommendation for Vue 3
- Better TypeScript support
- Simpler API, less boilerplate
- Built-in devtools support

### Why Mongoose over raw MongoDB?
- Schema validation
- Easier migrations
- Better TypeScript support with schemas
- Built-in virtuals and methods

### Why Mock Authentication?
- Focus on functionality demonstration
- Easier to test and demo
- Can be easily replaced with real auth

### Why Text Indexes?
- Efficient full-text search without regex
- Better performance for large datasets
- Weighted search (title more important than description)

## 👨‍💻 Author

Built for MileApp Technical Test

## 📄 License

This project is for technical assessment purposes.
