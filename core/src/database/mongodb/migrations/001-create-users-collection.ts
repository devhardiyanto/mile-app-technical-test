/**
 * MongoDB Migration: Create Users Collection
 * This migration will be automatically run when the model is first used
 * MongoDB creates collections automatically, but this serves as documentation
 */

import mongoose from 'mongoose';

export const up = async (): Promise<void> => {
  const db = mongoose.connection.db;
  
  // Create users collection if it doesn't exist
  const collections = await db?.listCollections({ name: 'users' }).toArray();
  
  if (!collections || collections.length === 0) {
    await db?.createCollection('users');
    console.log('✅ Created users collection');
  }
  
  // Create indexes
  await db?.collection('users').createIndex({ email: 1 }, { unique: true });
  console.log('✅ Created unique index on email');
};

export const down = async (): Promise<void> => {
  const db = mongoose.connection.db;
  
  // Drop the collection
  await db?.collection('users').drop();
  console.log('✅ Dropped users collection');
};
