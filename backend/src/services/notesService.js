import { ObjectId } from "mongodb";
import { getNotesCollection } from "../config/mongodb.js";
import { createNoteDocument, formatNoteResponse } from "../models/NoteModel.js";

export const getAllNotes = async () => {
  try {
    const collection = getNotesCollection();
    const notes = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return notes.map(formatNoteResponse);
  } catch (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
};

export const getNoteById = async (id) => {
  try {
    const collection = getNotesCollection();

    // Handle both string ID and ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return null;
    }

    const note = await collection.findOne({ _id: objectId });
    return note ? formatNoteResponse(note) : null;
  } catch (error) {
    throw new Error(`Failed to fetch note: ${error.message}`);
  }
};

export const createNote = async (noteData) => {
  try {
    // Validate required fields
    if (!noteData.title || noteData.title.trim() === "") {
      throw new Error("Title is required");
    }

    const collection = getNotesCollection();
    const noteDocument = createNoteDocument(noteData);

    const result = await collection.insertOne(noteDocument);

    return {
      id: result.insertedId.toString(),
      ...noteDocument,
    };
  } catch (error) {
    if (error.message === "Title is required") {
      throw error;
    }
    throw new Error(`Failed to create note: ${error.message}`);
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const collection = getNotesCollection();

    // Handle both string ID and ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return null;
    }

    // Validate title if provided
    if (noteData.title !== undefined && noteData.title.trim() === "") {
      throw new Error("Title cannot be empty");
    }

    const updateData = {};
    if (noteData.title !== undefined) updateData.title = noteData.title.trim();
    if (noteData.content !== undefined) updateData.content = noteData.content;
    if (noteData.tags !== undefined)
      updateData.tags = Array.isArray(noteData.tags) ? noteData.tags : [];
    if (noteData.attachments !== undefined)
      updateData.attachments = Array.isArray(noteData.attachments)
        ? noteData.attachments
        : [];
    updateData.updatedAt = new Date();

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result.value ? formatNoteResponse(result.value) : null;
  } catch (error) {
    if (error.message === "Title cannot be empty") {
      throw error;
    }
    throw new Error(`Failed to update note: ${error.message}`);
  }
};

export const deleteNote = async (id) => {
  try {
    const collection = getNotesCollection();

    // Handle both string ID and ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return null;
    }

    const result = await collection.findOneAndDelete({ _id: objectId });
    return result.value ? formatNoteResponse(result.value) : null;
  } catch (error) {
    throw new Error(`Failed to delete note: ${error.message}`);
  }
};
