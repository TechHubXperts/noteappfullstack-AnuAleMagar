import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import AddNoteModal from "./components/AddNoteModal";

const API_BASE_URL = "http://localhost:3000/api/Notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes from API
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching notes from:", API_BASE_URL);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }
      const data = await response.json();
      console.log("Notes fetched:", data);
      setNotes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notes from API on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const selectedNote = notes.find((note) => note.id === selectedNoteId) || null;

  const handleAddNote = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to save note: ${response.status}`);
      }

      const newNote = await response.json();
      console.log("Note created:", newNote);
      
      // Refresh notes list from API
      await fetchNotes();
      
      setIsAddModalOpen(false);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Error saving note:", err);
      alert(`Failed to save note: ${err.message}`);
    }
  };

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update note");
      }

      const updatedNote = await response.json();
      console.log("Note updated:", updatedNote);
      
      // Refresh notes list from API
      await fetchNotes();
    } catch (err) {
      console.error("Error updating note:", err);
      alert(`Failed to update note: ${err.message}`);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete note");
      }

      console.log("Note deleted:", noteId);

      // Refresh notes list from API
      await fetchNotes();
      
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
      alert(`Failed to delete note: ${err.message}`);
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
