import mongoose from 'mongoose';

import { env } from '../utils/env.js';

async function initMongoConnection() {
  try {
    const user = env('MONGODB_USER');
    const password = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');
    const DB_URI = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=MyCluster`;

    await mongoose.connect(DB_URI);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { initMongoConnection };
