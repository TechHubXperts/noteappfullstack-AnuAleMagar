import { ObjectId } from "mongodb";

export const noteSchema = {
  title: String,
  content: String,
  tags: [String],
  attachments: [String],
  createdAt: Date,
  updatedAt: Date,
};

// Note model - validates and transforms note data
export const createNoteDocument = (noteData) => {
  const now = new Date();
  return {
    title: noteData.title || "",
    content: noteData.content || "",
    tags: Array.isArray(noteData.tags) ? noteData.tags : [],
    attachments: Array.isArray(noteData.attachments)
      ? noteData.attachments
      : [],
    createdAt: noteData.createdAt || now,
    updatedAt: noteData.updatedAt || now,
  };
};

// Convert MongoDB document to API response format
export const formatNoteResponse = (mongoDoc) => {
  if (!mongoDoc) return null;

  return {
    id: mongoDoc._id.toString(),
    title: mongoDoc.title,
    content: mongoDoc.content,
    tags: mongoDoc.tags || [],
    attachments: mongoDoc.attachments || [],
    createdAt: mongoDoc.createdAt,
    updatedAt: mongoDoc.updatedAt,
  };
};

export default { noteSchema, createNoteDocument, formatNoteResponse };
