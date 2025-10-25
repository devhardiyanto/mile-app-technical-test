/**
 * MongoDB Indexes Creation Script for MileApp Task Management API
 * 
 * This script creates optimized indexes for the tasks collection
 * to improve query performance for common operations.
 * 
 * Run this script using:
 * mongosh mile_app database/indexes.js
 * 
 * Or via MongoDB Compass / MongoDB Shell:
 * use mile_app
 * load('database/indexes.js')
 */

// Switch to database
db = db.getSiblingDB('mile_app');

print('Creating indexes for tasks collection...\n');

/**
 * Index 1: user_id + created_at (Compound Index)
 * Purpose: Default listing - Get all tasks for a user sorted by creation date
 * Query Pattern: db.tasks.find({ user_id: "user_123" }).sort({ created_at: -1 })
 */
db.tasks.createIndex(
  { user_id: 1, created_at: -1 },
  { 
    name: 'idx_userId_createdAt',
    background: true,
    comment: 'Default task listing sorted by creation date'
  }
);
print('✓ Created index: idx_userId_createdAt');

/**
 * Index 2: user_id + status (Compound Index)
 * Purpose: Filter tasks by status (pending/completed)
 * Query Pattern: db.tasks.find({ user_id: "user_123", status: "pending" })
 */
db.tasks.createIndex(
  { user_id: 1, status: 1 },
  { 
    name: 'idx_userId_status',
    background: true,
    comment: 'Filter tasks by status'
  }
);
print('✓ Created index: idx_userId_status');

/**
 * Index 3: user_id + priority (Compound Index)
 * Purpose: Filter tasks by priority (low/medium/high)
 * Query Pattern: db.tasks.find({ user_id: "user_123", priority: "high" })
 */
db.tasks.createIndex(
  { user_id: 1, priority: 1 },
  { 
    name: 'idx_userId_priority',
    background: true,
    comment: 'Filter tasks by priority level'
  }
);
print('✓ Created index: idx_userId_priority');

/**
 * Index 4: user_id + status + created_at (Compound Index)
 * Purpose: Filter by status AND sort by date (common use case)
 * Query Pattern: db.tasks.find({ user_id: "user_123", status: "pending" }).sort({ created_at: -1 })
 */
db.tasks.createIndex(
  { user_id: 1, status: 1, created_at: -1 },
  { 
    name: 'idx_userId_status_createdAt',
    background: true,
    comment: 'Filter by status with date sorting'
  }
);
print('✓ Created index: idx_userId_status_createdAt');

/**
 * Index 5: Text Index for Full-Text Search
 * Purpose: Enable fast full-text search on title and description
 * Query Pattern: db.tasks.find({ $text: { $search: "urgent" } })
 * Note: Weighted - title is more important (3x) than description
 */
db.tasks.createIndex(
  { 
    title: 'text', 
    description: 'text' 
  },
  { 
    name: 'idx_text_search',
    weights: {
      title: 3,
      description: 1
    },
    background: true,
    comment: 'Full-text search on title and description'
  }
);
print('✓ Created index: idx_text_search (Full-text)');

/**
 * Index 6: user_id + updated_at (Compound Index)
 * Purpose: Sort tasks by last update time
 * Query Pattern: db.tasks.find({ user_id: "user_123" }).sort({ updated_at: -1 })
 */
db.tasks.createIndex(
  { user_id: 1, updated_at: -1 },
  { 
    name: 'idx_userId_updatedAt',
    background: true,
    comment: 'Sort tasks by last update'
  }
);
print('✓ Created index: idx_userId_updatedAt');

// Display all indexes
print('\n=== All Indexes Created Successfully ===\n');
print('Indexes on tasks collection:');
printjson(db.tasks.getIndexes());

print('\n=== Index Statistics ===');
db.tasks.stats().indexSizes ? 
  printjson(db.tasks.stats().indexSizes) : 
  print('No index size data available yet (empty collection)');

print('\n=== Performance Tips ===');
print('1. Always filter by user_id first (multi-tenant pattern)');
print('2. Use status/priority filters with user_id for optimal performance');
print('3. Text search is case-insensitive but slower than exact matches');
print('4. Indexes are created in background to avoid blocking writes');
print('5. Monitor index usage: db.tasks.aggregate([{ $indexStats: {} }])');
print('\nIndexes setup complete! 🎉');
