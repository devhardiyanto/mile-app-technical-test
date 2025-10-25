/**
 * Migration Runner for MongoDB
 * Usage: tsx src/database/mongodb/migrations/runner.ts [up|down]
 */

import { connectMongoDB, disconnectMongoDB } from '../connection';
import * as migration001 from './001-create-users-collection';

const migrations = [migration001];

const runMigrations = async (direction: 'up' | 'down' = 'up'): Promise<void> => {
  try {
    await connectMongoDB();
    console.log(`\n🚀 Running MongoDB migrations (${direction})...\n`);

    for (const migration of migrations) {
      if (direction === 'up') {
        await migration.up();
      } else {
        await migration.down();
      }
    }

    console.log('\n✅ All migrations completed successfully\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await disconnectMongoDB();
    process.exit(0);
  }
};

// Get direction from command line args
const direction = (process.argv[2] as 'up' | 'down') || 'up';
runMigrations(direction);
