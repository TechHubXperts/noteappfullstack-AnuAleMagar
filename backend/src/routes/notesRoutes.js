import express from 'express';
import * as notesController from '../controllers/notesController.js';

const router = express.Router();

// GET /api/Notes - Get all notes
router.get('/', notesController.getAllNotes);

// GET /api/Notes/:id - Get a single note by ID
router.get('/:id', notesController.getNoteById);

// POST /api/Notes - Create a new note
router.post('/', notesController.createNote);

// PUT /api/Notes/:id - Update a note
router.put('/:id', notesController.updateNote);

// DELETE /api/Notes/:id - Delete a note
router.delete('/:id', notesController.deleteNote);

export default router;
