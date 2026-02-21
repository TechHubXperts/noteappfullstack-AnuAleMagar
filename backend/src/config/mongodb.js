import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

// Extract DB name from URI, or use DB_NAME env var, or default to "note_app"
const getDBName = () => {
  if (process.env.DB_NAME) return process.env.DB_NAME;
  try {
    const url = new URL(MONGO_URI);
    const dbFromUri = url.pathname.slice(1); // Remove leading /
    if (dbFromUri) return dbFromUri;
  } catch {
    // If URL parsing fails, try regex
    const match = MONGO_URI.match(/\/([^/?]+)(\?|$)/);
    if (match && match[1]) return match[1];
  }
  return "note_app";
};

const DB_NAME = getDBName();

let mongoClient = null;
let db = null;
let notesCollection = null;

export const connectMongoDB = async () => {
  try {
    if (mongoClient && db) {
      console.log("MongoDB already connected");
      return { db, notesCollection };
    }

    mongoClient = new MongoClient(MONGO_URI);
    await mongoClient.connect();
    console.log("MongoDB connected successfully");

    db = mongoClient.db(DB_NAME);
    notesCollection = db.collection("notes");

    // Create indexes
    await notesCollection.createIndex({ createdAt: -1 });

    console.log(`Using database: ${DB_NAME}`);
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
