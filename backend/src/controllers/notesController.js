import * as notesService from '../services/notesService.js';

export const getAllNotes = async (req, res) => {
  try {
    const notes = await notesService.getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await notesService.getNoteById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

export const createNote = async (req, res) => {
  try {
    const noteData = req.body;

    // Validate title
    if (!noteData.title || noteData.title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = await notesService.createNote(noteData);
    res.status(200).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    if (error.message === 'Title is required') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const noteData = req.body;

    // Validate title if provided
    if (noteData.title !== undefined && noteData.title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const note = await notesService.updateNote(id, noteData);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    if (error.message === 'Title cannot be empty') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await notesService.deleteNote(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

