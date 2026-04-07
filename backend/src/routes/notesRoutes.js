import express from 'express';
import * as notesController from '../controllers/notesController.js';

const router = express.Router();

// GET /api/notes - Get all notes
router.get('/', notesController.getAllNotes);

// GET /api/notes/:id - Get a single note by ID
router.get('/:id', notesController.getNoteById);

// POST /api/notes - Create a new note
router.post('/', notesController.createNote);

// PUT /api/notes/:id - Update a note
router.put('/:id', notesController.updateNote);

// DELETE /api/notes/reset/all - Delete all notes (must come before /:id)
router.delete('/reset/all', notesController.resetAllNotes);

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', notesController.deleteNote);

export default router;
