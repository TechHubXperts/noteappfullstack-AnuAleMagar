import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGODB_URI;

let mongoClient = null;
let db = null;
let notesCollection = null;

export const connectMongoDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("Missing required environment variable: MONGODB_URI");
    }

    if (mongoClient && db) {
      console.log("MongoDB already connected");
      return { db, notesCollection };
    }

    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    console.log("MongoDB connected successfully");

    db = mongoClient.db();
    notesCollection = db.collection("notes");

    await notesCollection.createIndex({ createdAt: -1 });

    console.log(`Using database: ${db.databaseName}`);
    return { db, notesCollection };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export const disconnectMongoDB = async () => {
  try {
    if (mongoClient) {
      await mongoClient.close();
      mongoClient = null;
      db = null;
      notesCollection = null;
      console.log("MongoDB disconnected");
    }
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
};

export const getNotesCollection = () => {
  if (!notesCollection) {
    throw new Error("Database not initialized. Call connectMongoDB first.");
  }
  return notesCollection;
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectMongoDB first.");
  }
  return db;
};

export default { connectMongoDB, disconnectMongoDB, getNotesCollection, getDB };
