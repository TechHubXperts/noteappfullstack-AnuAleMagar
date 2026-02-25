import { useState, useEffect } from "react";
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

  // Fetch notes from API on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        setNotes(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError(err.message);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

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
        const errorText = await response.text();
        throw new Error(`Failed to save note: ${response.status}`);
      }

      const newNote = await response.json();
      
      // Refresh notes list from API
      const refreshResponse = await fetch(API_BASE_URL);
      if (refreshResponse.ok) {
        const allNotes = await refreshResponse.json();
        setNotes(allNotes);
      } else {
        // Fallback: add to local state
        setNotes([newNote, ...notes]);
      }
      
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
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();
      
      // Refresh notes list from API
      const refreshResponse = await fetch(API_BASE_URL);
      if (refreshResponse.ok) {
        const allNotes = await refreshResponse.json();
        setNotes(allNotes);
      } else {
        // Fallback: update local state
        setNotes(notes.map((note) => (note.id === noteId ? updatedNote : note)));
      }
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      // Refresh notes list from API
      const refreshResponse = await fetch(API_BASE_URL);
      if (refreshResponse.ok) {
        const allNotes = await refreshResponse.json();
        setNotes(allNotes);
      } else {
        // Fallback: remove from local state
        setNotes(notes.filter((note) => note.id !== noteId));
      }
      
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
