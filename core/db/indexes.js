/**
 * MongoDB Index Creation Script
 * 
 * This script creates optimized indexes for the Task collection to support
 * efficient querying, filtering, sorting, and pagination.
 * 
 * Run this script using:
 * node db/indexes.js
 * 
 * Or using MongoDB shell:
 * mongosh < db/indexes.js
 */

// Connect to the database
const db = db.getSiblingDB('mile_app');

// Drop existing indexes (except _id) - optional, uncomment if needed
// db.tasks.dropIndexes();

console.log('Creating indexes for tasks collection...');

// 1. Compound index for userId + createdAt (most common query pattern)
// This supports: filtering by userId and sorting by createdAt (desc)
// Used for: GET /tasks with default sorting
db.tasks.createIndex(
  { userId: 1, createdAt: -1 },
  { 
    name: 'idx_userId_createdAt',
    background: true 
  }
);
console.log('✓ Created index: idx_userId_createdAt');

// 2. Compound index for userId + status
// This supports: filtering tasks by user and status (pending/completed)
// Used for: GET /tasks?status=pending
db.tasks.createIndex(
  { userId: 1, status: 1 },
  { 
    name: 'idx_userId_status',
    background: true 
  }
);
console.log('✓ Created index: idx_userId_status');

// 3. Compound index for userId + priority
// This supports: filtering tasks by user and priority level
// Used for: GET /tasks?priority=high
db.tasks.createIndex(
  { userId: 1, priority: 1 },
  { 
    name: 'idx_userId_priority',
    background: true 
  }
);
console.log('✓ Created index: idx_userId_priority');

// 4. Compound index for userId + status + createdAt
// This is the most optimized index for common queries with filtering and sorting
// Used for: GET /tasks?status=pending&sortBy=createdAt
db.tasks.createIndex(
  { userId: 1, status: 1, createdAt: -1 },
  { 
    name: 'idx_userId_status_createdAt',
    background: true 
  }
);
console.log('✓ Created index: idx_userId_status_createdAt');

// 5. Text index for search functionality
// This supports: full-text search on title and description
// Used for: GET /tasks?search=trash
db.tasks.createIndex(
  { title: 'text', description: 'text' },
  { 
    name: 'idx_text_search',
    background: true,
    weights: {
      title: 10,      // Title is more important than description
      description: 5
    }
  }
);
console.log('✓ Created index: idx_text_search');

// 6. Index for updatedAt (for sorting by last updated)
// Used for: GET /tasks?sortBy=updatedAt
db.tasks.createIndex(
  { userId: 1, updatedAt: -1 },
  { 
    name: 'idx_userId_updatedAt',
    background: true 
  }
);
console.log('✓ Created index: idx_userId_updatedAt');

console.log('\n=== Index Creation Summary ===');
console.log('All indexes created successfully!');
console.log('\nIndex Strategy Explanation:');
console.log('1. userId is always the first field because all queries are scoped to a specific user');
console.log('2. Compound indexes support both filtering and sorting operations');
console.log('3. Text index enables efficient full-text search on title and description');
console.log('4. Indexes are created in background to avoid blocking operations');
console.log('5. The most specific index (userId + status + createdAt) handles the most common query pattern');

// List all indexes for verification
console.log('\n=== Current Indexes ===');
db.tasks.getIndexes().forEach(function(index) {
  console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
});
