import mongoose from 'mongoose';

import 'dotenv/config';

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const url = process.env.MONGODB_URL;
const db = process.env.MONGODB_DB;
const DB_URI = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=MyCluster`;

async function initMongoConnection() {
  try {
    await mongoose.connect(DB_URI);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { initMongoConnection };
