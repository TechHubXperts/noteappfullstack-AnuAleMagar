// In-memory storage for notes
let notes = [];
let nextId = 1;

// Helper function to generate unique ID
const generateId = () => {
  return `note_${Date.now()}_${nextId++}`;
};

export const getAllNotes = async () => {
  try {
    // Return all notes sorted by createdAt (newest first)
    return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
};

export const getNoteById = async (id) => {
  try {
    const note = notes.find((n) => n.id === id);
    return note || null;
  } catch (error) {
    throw new Error(`Failed to fetch note: ${error.message}`);
  }
};

export const createNote = async (noteData) => {
  try {
    // Validate required fields
    if (!noteData.title || noteData.title.trim() === '') {
      throw new Error('Title is required');
    }

    const now = new Date().toISOString();
    const newNote = {
      id: generateId(),
      title: noteData.title.trim(),
      content: noteData.content || '',
      tags: Array.isArray(noteData.tags) ? noteData.tags : [],
      attachments: Array.isArray(noteData.attachments) ? noteData.attachments : [],
      createdAt: now,
      updatedAt: now,
    };

    notes.push(newNote);
    return newNote;
  } catch (error) {
    if (error.message === 'Title is required') {
      throw error;
    }
    throw new Error(`Failed to create note: ${error.message}`);
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      return null;
    }

    // Validate title if provided
    if (noteData.title !== undefined && noteData.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    const existingNote = notes[noteIndex];
    const updatedNote = {
      ...existingNote,
      title: noteData.title !== undefined ? noteData.title.trim() : existingNote.title,
      content: noteData.content !== undefined ? noteData.content : existingNote.content,
      tags: noteData.tags !== undefined ? (Array.isArray(noteData.tags) ? noteData.tags : []) : existingNote.tags,
      attachments: noteData.attachments !== undefined ? (Array.isArray(noteData.attachments) ? noteData.attachments : []) : existingNote.attachments,
      updatedAt: new Date().toISOString(),
    };

    notes[noteIndex] = updatedNote;
    return updatedNote;
  } catch (error) {
    if (error.message === 'Title cannot be empty') {
      throw error;
    }
    throw new Error(`Failed to update note: ${error.message}`);
  }
};

export const deleteNote = async (id) => {
  try {
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      return null;
    }

    const deletedNote = notes[noteIndex];
    notes = notes.filter((n) => n.id !== id);
    return deletedNote;
  } catch (error) {
    throw new Error(`Failed to delete note: ${error.message}`);
  }
};
