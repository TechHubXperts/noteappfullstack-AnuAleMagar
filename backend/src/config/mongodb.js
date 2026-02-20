import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || "note_app";

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
