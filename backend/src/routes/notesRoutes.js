import express from 'express';
import * as notesController from '../controllers/notesController.js';

const router = express.Router();

// Special routes (must come before :id routes)
// DELETE /api/Notes/reset/all - Delete all notes
router.delete('/reset/all', notesController.resetAllNotes);

// GET /api/Notes - Get all notes
router.get('/', notesController.getAllNotes);

// POST /api/Notes - Create a new note
router.post('/', notesController.createNote);

// GET /api/Notes/:id - Get a single note by ID
router.get('/:id', notesController.getNoteById);

// PUT /api/Notes/:id - Update a note
router.put('/:id', notesController.updateNote);

// PATCH /api/Notes/:id - Update a note (alternative to PUT)
router.patch('/:id', notesController.updateNote);

// DELETE /api/Notes/:id - Delete a note
router.delete('/:id', notesController.deleteNote);

export default router;
