import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import AddNoteModal from "./components/AddNoteModal";

const STORAGE_KEY = "notesApp_notes";

// Helper functions for localStorage
const loadNotesFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Error loading notes from storage:", err);
    return [];
  }
};

const saveNotesToStorage = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error("Error saving notes to storage:", err);
  }
};

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isInitialLoadRef = useRef(true);

  // Load notes from localStorage on mount
  useEffect(() => {
    const loadedNotes = loadNotesFromStorage();
    setNotes(loadedNotes);
    isInitialLoadRef.current = false;
  }, []);

  // Save notes to localStorage whenever notes change (but not on initial load)
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      saveNotesToStorage(notes);
    }
  }, [notes]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  const handleAddNote = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNote = (noteData) => {
    try {
      const now = new Date().toISOString();
      const newNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: noteData.title,
        content: noteData.content || "",
        tags: noteData.tags || [],
        attachments: noteData.attachments || [],
        createdAt: now,
        updatedAt: now,
      };

      console.log("Saving note:", newNote);
      setNotes([newNote, ...notes]);
      setIsAddModalOpen(false);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Error saving note:", err);
      alert(`Failed to save note: ${err.message}`);
    }
  };

  const handleUpdateNote = (noteId, noteData) => {
    try {
      const existingNote = notes.find((note) => note.id === noteId);
      if (!existingNote) {
        throw new Error("Note not found");
      }

      const updatedNote = {
        ...existingNote,
        title: noteData.title,
        content: noteData.content || "",
        updatedAt: new Date().toISOString(),
      };

      console.log("Updating note:", updatedNote);
      setNotes(notes.map((note) => (note.id === noteId ? updatedNote : note)));
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note");
    }
  };

  const handleDeleteNote = (noteId) => {
    try {
      console.log("Deleting note:", noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        onAddNote={handleAddNote}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        searchQuery={searchQuery}
        testId="note-list"
      />
      <NoteEditor note={selectedNote} onDelete={handleDeleteNote} onUpdate={handleUpdateNote} />
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}

export default App;
